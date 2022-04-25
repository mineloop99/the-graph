import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, STASH, STASH_ADDRESS } from '../../../packages/constants/index.template'

import { ERC20 } from '../../generated/Stash/ERC20'
import { ERC20NameBytes } from '../../generated/Stash/ERC20NameBytes'
import { ERC20SymbolBytes } from '../../generated/Stash/ERC20SymbolBytes'
import { Token } from '../../generated/schema'
import { getStash } from './Stash'

export function getToken(): Token {
  let token = Token.load(STASH_ADDRESS.toHexString())

  if (token === null) {
    const stash = getStash()
    stash.id = BigInt.fromI32(parseFloat(stash.id) as i32).plus(BigInt.fromI32(1)).toString()
    stash.save()
    token = new Token(STASH_ADDRESS.toHexString())
    token.id = STASH_ADDRESS.toHexString()
    token.totalSupply = getTotalSupply()
    token.save()
  }

  return token
}

export function getTotalSupply(): BigDecimal {

  const contract = ERC20.bind(STASH_ADDRESS)
  let totalSupplyValue:BigDecimal
  const totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) { 
      totalSupplyValue = totalSupplyResult.value.toBigDecimal()
      return totalSupplyValue
  }
    return BIG_DECIMAL_ZERO
}

export function getBalance(address:Address): BigDecimal {

  const contract = ERC20.bind(STASH_ADDRESS)
  let balance:BigDecimal
  const balanceResult = contract.try_balanceOf(address)
  if (!balanceResult.reverted) { 
      balance = balanceResult.value.toBigDecimal()
      return balance 
  }
    return BIG_DECIMAL_ZERO
}