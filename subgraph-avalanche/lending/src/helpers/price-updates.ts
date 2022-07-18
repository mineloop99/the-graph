import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts';

import {
  PriceHistoryItem,
  PriceOracle as HunnyOracle,
  PriceOracleAsset,
  UsdEthPriceHistoryItem,
} from '../../generated/schema';
import { getOrInitPriceOracle, getPriceOracleAsset } from './initializers';
import { PriceOracle } from '../../generated/PriceOracle/PriceOracle';

export function savePriceToHistory(oracleAsset: PriceOracleAsset, event: ethereum.Event): void {
  let id = oracleAsset.id + event.block.number.toString() + event.transaction.index.toString();
  let priceHistoryItem = new PriceHistoryItem(id);
  priceHistoryItem.asset = oracleAsset.id;
  priceHistoryItem.price = oracleAsset.price;
  priceHistoryItem.decimals = oracleAsset.decimals;
  priceHistoryItem.timestamp = oracleAsset.lastUpdateTimestamp;
  priceHistoryItem.save();
}

// Method called for external pool updates Uniswap / balancer etc
export function updateAssetPriceFromAaveOracle(event: ethereum.Event): void {
  let assetAddress = event.address;
  let priceOracle = getOrInitPriceOracle();
  let priceOracleAsset = getPriceOracleAsset(assetAddress.toHexString());
  let proxyPriceProvider = PriceOracle.bind(
    Address.fromString(priceOracle.proxyPriceProvider.toHexString())
  );

  let assetPriceCall = proxyPriceProvider.try_getAssetPriceUSD(assetAddress);
  if (!assetPriceCall.reverted) {
    priceOracleAsset.decimals = assetPriceCall.value.value0;
    priceOracleAsset.price = assetPriceCall.value.value1;
    priceOracleAsset.save();

    // save price to history
    savePriceToHistory(priceOracleAsset, event);
  } else {
    log.error('Error in getting price from Liquidity Pool price feed for asset: {}', [
      assetAddress.toHexString(),
    ]);
  }
}

export function updateDependentAssets(dependentAssets: string[], event: ethereum.Event): void {
  let proxyPriceProviderAddress = getOrInitPriceOracle().proxyPriceProvider;
  let proxyPriceProvider = PriceOracle.bind(
    Address.fromString(proxyPriceProviderAddress.toHexString())
  );

  // update dependent assets price
  for (let i = 0; i < dependentAssets.length; i += 1) {
    let dependentAsset = dependentAssets[i];
    let dependentOracleAsset = getPriceOracleAsset(dependentAsset);
    let assetPrice = proxyPriceProvider.try_getAssetPriceUSD(
      Address.fromString(dependentOracleAsset.id)
    );
    if (!assetPrice.reverted) {
        dependentOracleAsset.decimals = assetPrice.value.value0;
        dependentOracleAsset.price = assetPrice.value.value1;
    } else {
      log.error(
        'DependentAsset: {} | OracleAssetId: {} | proxyPriceProvider: {} | EventAddress: {}',
        [
          dependentAsset,
          dependentOracleAsset.id,
          proxyPriceProviderAddress.toHexString(),
          event.address.toHexString(),
        ]
      );
    }
    dependentOracleAsset.save();
    savePriceToHistory(dependentOracleAsset, event);
  }
}

export function usdEthPriceUpdate(
  priceOracle: HunnyOracle,
  price: BigInt,
  event: ethereum.Event
): void {
  priceOracle.usdPriceEth = price;
  priceOracle.lastUpdateTimestamp = event.block.timestamp.toI32();
  priceOracle.save();

  let usdEthPriceHistoryItem = new UsdEthPriceHistoryItem(
    event.block.number.toString() + event.transaction.index.toString()
  );
  usdEthPriceHistoryItem.oracle = priceOracle.id;
  usdEthPriceHistoryItem.price = priceOracle.usdPriceEth;
  usdEthPriceHistoryItem.timestamp = priceOracle.lastUpdateTimestamp;
  usdEthPriceHistoryItem.save();

  updateDependentAssets(priceOracle.usdDependentAssets, event);
}

export function genericPriceUpdate(
  oracleAsset: PriceOracleAsset, 
  price: BigInt,
  event: ethereum.Event
): void {
    oracleAsset.price = price; 
  oracleAsset.lastUpdateTimestamp = event.block.timestamp.toI32();
  oracleAsset.save();
  // add new price to history
  savePriceToHistory(oracleAsset, event);
  updateDependentAssets(oracleAsset.dependentAssets, event);
}
