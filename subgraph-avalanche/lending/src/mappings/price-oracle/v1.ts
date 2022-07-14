import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts';

import {
  AssetPriceUpdated,
  EthPriceUpdated,
} from '../../../generated/templates/FallbackPriceOracle/PriceOracle';
import { AnswerUpdated } from '../../../generated/templates/ChainlinkAggregator/IExtendedPriceAggregator';
import { formatUsdEthChainlinkPrice, zeroBI } from '../../utils/converters';
import {
  getChainlinkAggregator,
  getOrInitPriceOracle,
  getPriceOracleAsset,
} from '../../helpers/v3/initializers';
import { PriceOracle } from '../../../generated/schema'; 
// GANACHE
export function handleAssetPriceUpdated(event: AssetPriceUpdated): void {
  let oracleAsset = getPriceOracleAsset(event.params._asset.toHexString());
  genericPriceUpdate(oracleAsset, event.params._price, event);
}
 
// Ropsten and Mainnet
export function handleChainlinkAnswerUpdated(event: AnswerUpdated): void {
  let priceOracle = getOrInitPriceOracle();
  let chainlinkAggregator = getChainlinkAggregator(event.address.toHexString());

  if (priceOracle.usdPriceEthMainSource.equals(event.address)) {
    let proxyPriceProvider = AaveOracle.bind(
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
        let proxyPriceProvider = AaveOracle.bind(
          Address.fromString(priceOracle.proxyPriceProvider.toHexString())
        );
        let assetPrice = proxyPriceProvider.try_getAssetPrice(Address.fromString(oracleAsset.id));
        if (!assetPrice.reverted) {
          genericPriceUpdate(oracleAsset, assetPrice.value, event);
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