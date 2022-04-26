
import {
  Transfer as TransferEvent,
} from '../../generated/Stash/ERC20'
import {
  LogRebase as LogRebaseEvent,
} from '../../generated/Stash/Stash'

import {
  getBalance, getToken,
} from '../entities'
import { getHolder } from '../entities/holder'

export function onTransfer(event: TransferEvent): void {
  const token = getToken()
  if (token === null) {
    return
  }
  // Force creation of users if not already known will be lazily created
  getHolder(event.params.from)

  const holder = getHolder(event.params.to)
  // liquidity token amount being transfered
  // const value = event.params.value.divDecimal(BigDecimal.fromString('1e18'))
  const balance = getBalance(event.params.to)
  holder.balance = balance;
  holder.save();
}

export function onLogRebase(event: LogRebaseEvent): void {
  const token = getToken()
  if (token === null) {
    return
  }
  const holder = getHolder(event.transaction.from);
  const balance = getBalance(event.transaction.from);
  const totalEarned = holder.totalEarned.plus(event.params.totalSupply.toBigDecimal());
  holder.balance = balance;
  holder.epoch = holder.epoch.plus(event.params.epoch.toBigDecimal());
  holder.totalEarned = totalEarned;
  holder.save();
}
