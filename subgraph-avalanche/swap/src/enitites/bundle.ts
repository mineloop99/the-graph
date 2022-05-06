import { BIG_DECIMAL_ZERO } from '../../../packages/constants/index.template'
import { Bundle } from '../../generated/schema'

export function getBundle(): Bundle {
  let bundle = Bundle.load('1')

  if (bundle === null) {
    bundle = new Bundle('1')
    bundle.avaxPrice = BIG_DECIMAL_ZERO
    bundle.save()
  }

  return bundle as Bundle
}
