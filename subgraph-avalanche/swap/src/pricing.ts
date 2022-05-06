import { 
  AVAX_USD_ADDRESS,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  NATIVE,
  XOXO_USDT_PAIR_ADDRESS,
} from '../../packages/constants/index.template'
import { Address, BigDecimal } from '@graphprotocol/graph-ts'
import { Pair, Token } from '../generated/schema'

import { Factory as FactoryContract } from '../generated/templates/Pair/Factory'
import { AggregatorV3 as AggregatorV3Contract } from '../generated/Factory/AggregatorV3'
// export const uniswapFactoryContract = FactoryContract.bind(Address.fromString("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"))

export const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)

export function getXoXoPrice(): BigDecimal {
  const pair = Pair.load(XOXO_USDT_PAIR_ADDRESS.toHexString())

  if (pair) {
    return pair!.token1Price
  }

  return BIG_DECIMAL_ZERO
}

export function getAvaxPrice(): BigDecimal {
  const contract = AggregatorV3Contract.bind(AVAX_USD_ADDRESS)
  let balance:BigDecimal
  const balanceResult = contract.try_latestRoundData()
  if (!balanceResult.reverted) { 
      balance = balanceResult.value.value1.toBigDecimal()
      return balance
  }
    return BIG_DECIMAL_ZERO
}


export function findAvaxPerToken(token: Token): BigDecimal {
  if (Address.fromString(token.id) == NATIVE) {
    return BIG_DECIMAL_ONE
  }

  const whitelist = token.whitelistPairs

  for (let i = 0; i < whitelist.length; ++i) {
    const pairAddress = whitelist[i]
    const pair = Pair!.load(pairAddress)

    if (pair!.token0 == token.id) {
      const token1 = Token.load(pair!.token1)

      return pair!.token1Price.times(token1!.derivedAVAX as BigDecimal) // return token1 per our token * Eth per token 1
    }

    if (pair!.token1 == token.id) {
      const token0 = Token.load(pair!.token0)
      return pair!.token0Price.times(token0!.derivedAVAX as BigDecimal) // return token0 per our token * ETH per token 0
    }
  }

  return BIG_DECIMAL_ZERO // nothing was found return 0
}