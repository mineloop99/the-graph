import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts';

import {
  PriceUpdate, 
} from '../../../generated/PriceOracle/PriceOracle';
import { AnswerUpdated } from '../../../generated/ChainlinkAggregator/AggregatorV3';
import { formatUsdEthChainlinkPrice, zeroBI } from '../../utils/converters';
import { 
  getChainlinkAggregator, 
  getOrInitPriceOracle,
  getPriceOracleAsset,
} from '../../helpers/initializers'; 
import { MOCK_USD_ADDRESS } from '../../utils/constants';
import {PriceOracle as HunnyOracle} from '../../../generated/schema'
import { PriceOracle } from '../../../generated/PriceOracle/PriceOracle'; 
import { genericPriceUpdate, usdEthPriceUpdate } from '../../helpers/price-updates';
// GANACHE
export function handleAssetPriceUpdated(event: PriceUpdate): void {
  let oracleAsset = getPriceOracleAsset(event.params.token.toHexString());
  genericPriceUpdate(oracleAsset, event.params.tokenPrice, event);
}

function genericHandleChainlinkUSDETHPrice(
  price: BigInt,
  event: ethereum.Event,
  priceOracle: HunnyOracle,
  proxyPriceProvider: PriceOracle
): void {
  if (price.gt(zeroBI())) {
    priceOracle.usdPriceEthFallbackRequired = false;
    usdEthPriceUpdate(priceOracle, formatUsdEthChainlinkPrice(price), event);
  } else {
    priceOracle.usdPriceEthFallbackRequired = true;
    usdEthPriceUpdate(
      priceOracle,
      formatUsdEthChainlinkPrice(
        proxyPriceProvider.getAssetPriceUSD(Address.fromString(MOCK_USD_ADDRESS)).value1
      ),
      event
    );
  }
}

// Ropsten and Mainnet
export function handleChainlinkAnswerUpdated(event: AnswerUpdated): void {
  let priceOracle = getOrInitPriceOracle();
  let chainlinkAggregator = getChainlinkAggregator(event.address.toHexString());

  if (priceOracle.usdPriceEthMainSource.equals(event.address)) {
    let proxyPriceProvider = PriceOracle.bind(
      Address.fromString(priceOracle.proxyPriceProvider.toHexString())
    );
    genericHandleChainlinkUSDETHPrice(event.params.current, event, priceOracle, proxyPriceProvider);
  } else {
    let oracleAsset = getPriceOracleAsset(chainlinkAggregator.oracleAsset);

    // if it's correct oracle for this asset
    if (oracleAsset.priceSource.equals(event.address)) {
      // if oracle answer is valid
      if (event.params.current.gt(zeroBI())) {
        oracleAsset.isFallbackRequired = false;
        genericPriceUpdate(oracleAsset, event.params.current, event);

        let updatedTokensWithFallback = [] as string[];
        if (priceOracle.tokensWithFallback.includes(oracleAsset.id)) {
          for (let i = 0; i > priceOracle.tokensWithFallback.length; i++) {
            if ((priceOracle.tokensWithFallback as string[])[i] != oracleAsset.id) {
              updatedTokensWithFallback.push((priceOracle.tokensWithFallback as string[])[i]);
            }
          }
          priceOracle.tokensWithFallback = updatedTokensWithFallback;
          priceOracle.save();
        }
      } else {
        // oracle answer invalid, start using fallback oracle
        oracleAsset.isFallbackRequired = true;
        let proxyPriceProvider = PriceOracle.bind(
          Address.fromString(priceOracle.proxyPriceProvider.toHexString())
        );
        let assetPrice = proxyPriceProvider.try_getAssetPriceUSD(Address.fromString(oracleAsset.id));
        if (!assetPrice.reverted) {
          genericPriceUpdate(oracleAsset, assetPrice.value.value1, event);
        } else {
          log.error(
            'OracleAssetId: {} | ProxyPriceProvider: {} | EventParamsCurrent: {} | EventAddress: {}',
            [
              oracleAsset.id,
              priceOracle.proxyPriceProvider.toHexString(),
              event.params.current.toString(),
              event.address.toHexString(),
            ]
          );
        }

        if (!priceOracle.tokensWithFallback.includes(oracleAsset.id)) {
          let updatedTokensWithFallback = priceOracle.tokensWithFallback;
          updatedTokensWithFallback.push(oracleAsset.id);
          priceOracle.tokensWithFallback = updatedTokensWithFallback;
          priceOracle.save();
        }
      }
    }
  }
}
