import { Address } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, STASH_ADDRESS } from '../../../packages/constants/index.template'
import {  Stash } from '../../generated/schema'

export function getStash(id: Address = STASH_ADDRESS): Stash {
  let stash = Stash.load(id.toHexString())

  if (stash === null) {
    stash = new Stash(id.toHexString())
    stash.averageHolding = BIG_DECIMAL_ZERO;
    stash.backedLiquidity = BIG_DECIMAL_ZERO;
    stash.liquidity = BIG_DECIMAL_ZERO;
    stash.timestamp = BIG_DECIMAL_ZERO;
    stash.treasury = BIG_DECIMAL_ZERO;
    stash.rfv = BIG_DECIMAL_ZERO;
    stash.price = BIG_DECIMAL_ZERO;
    stash.save()
  }

  return stash as Stash
}
