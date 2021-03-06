import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts/common/numbers'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')

export const BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const BIG_DECIMAL_ZERO = BigDecimal.fromString('0')

export const BIG_DECIMAL_ONE = BigDecimal.fromString('1')

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_TWO = BigInt.fromI32(2)

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100)

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const LOCKUP_POOL_NUMBER = BigInt.fromI32(29)

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_SUSHI_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const ACC_SUSHI_PRECISION = BigInt.fromString('1000000000000')

export const BENTOBOX_DEPOSIT = 'deposit'

export const BENTOBOX_TRANSFER = 'transfer'

export const BENTOBOX_WITHDRAW = 'withdraw'

export const KASHI_PAIR_MEDIUM_RISK_TYPE = 'medium'

export const PAIR_ADD_COLLATERAL = 'addCollateral'

export const PAIR_REMOVE_COLLATERAL = 'removeCollateral'

export const PAIR_ADD_ASSET = 'addAsset'

export const PAIR_REMOVE_ASSET = 'removeAsset'

export const PAIR_BORROW = 'borrow'

export const PAIR_REPAY = 'repay'

export const FACTORY_ADDRESS = Address.fromString(
  "0xc66F594268041dB60507F00703b152492fb176E7"
)
 
export const USDC_WETH_PAIR =
  "0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0"

export const DAI_WETH_PAIR =
  "0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90"

export const USDT_WETH_PAIR =
  "0x03B666f3488a7992b2385B12dF7f35156d7b29cD"

export const XOXO_USDT_PAIR = "0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c"

export const XOXO_USDT_PAIR_ADDRESS = Address.fromString("0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c")

export const UNISWAP_XOXO_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const XOXO_WETH_USDT_PAIR_ADDRESS =
 Address.fromString("0x905dfcd5649217c42684f23958568e533c711aa3" )

export const UNISWAP_XOXO_USDT_PAIR_ADDRESS = Address.fromString("0x905dfcd5649217c42684f23958568e533c711aa3")
// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  "1000"
)

export const XOXO_TOKEN_ADDRESS = Address.fromString(
  "0xFa94348467f64D5A457F75F8bc40495D33c65aBB"
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('15000')

export const WETH_ADDRESS = Address.fromString(
  "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB"
) 

export const USDT_ADDRESS = Address.fromString(
  "0x4988a896b1227218e4A686fdE5EabdcAbd91571f"
)  
 

export const USDC = "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802"

export const USDT = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"

export const DAI = "0xe3520349F477A5F6EB06107066048508498A291b"
export const NATIVE = Address.fromString(
  "0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e"
)
export const WHITELIST: string[] = '{{ whitelist }}'.split(',')

// export const WHITELIST: string[] = [
//   "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
//   "0x6983d1e6def3690c4d616b13597a09e6193ea013",
//   "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
//   "0x985458e523db3d53125813ed68c274899e9dfab4",
//   "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
//   "0xe176ebe47d621b984a73036b9da5d834411ef734",
// ]

// export const WHITELIST: string[] = [
//   "0x471ece3750da237f93b8e339c536989b8978a438",
//   "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
//   "0x765de816845861e75a25fca122bb6898b8b1282a",
//   "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73"
// ];

const CUSTOM_BASES = new Map<string, string>()
