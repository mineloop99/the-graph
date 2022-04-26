import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, STASH } from '../../../packages/constants/index.template'

import { Holder } from '../../generated/schema'
import { getToken } from './token'

export function getHolder(address: Address): Holder {
  let holder = Holder.load(address.toHexString())

  // If no holder, create one
  if (holder === null) {
    holder = createHolder(address)
  }

  return holder as Holder
}

export function createHolder(address: Address): Holder {
  // Update holder count on factory
  const token = getToken()
  token.holdersCount = token.holdersCount.digits.plus(BigInt.fromI32(1)).toBigDecimal()
  token.save()

  const holder = new Holder(address.toHexString())
  holder.token = token.id;
  holder.save()
  return holder as Holder
}