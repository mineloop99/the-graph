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

export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('3')

export const FACTORY_ADDRESS = Address.fromString(
  "0x58a08bc28f3e8dab8fb2773d8f243bc740398b09"
)

export const XOXO_TOKEN_ADDRESS = Address.fromString(
  "0x25afD99fcB474D7C336A2971F26966da652a92bc"
)

export const AVAX_USD_DATA_FEEDS_ADDRESS = Address.fromString(
  "0x0A77230d17318075983913bC2145DB16C7366156"
)

export const XOXO_USDT_PAIR_ADDRESS = Address.fromString(
  "0x985E3f704a28FBAeA6Fe66403Db94A4C1c4FC457"
)

export const USDT_ADDRESS = Address.fromString(
  "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
)

export const NATIVE = Address.fromString(
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
)

export const WHITELIST: string[] = [
  "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
  "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
  "0x50b7545627a5162f82a992c33b87adc75187b218",
  "0x130966628846bfd36ff31a822705796e8cb8c18d",
  "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
  "0xc7198437980c041c805a1edcba50c1ce5db95118",
  "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
  "0x25afD99fcB474D7C336A2971F26966da652a92bc"
]