
import {
  Transfer as TransferEvent,
} from '../../generated/Stash/ERC20'
import {
  LogRebase as LogRebaseEvent,
} from '../../generated/Stash/Stash'
import {
  EventTransfer
} from '../../generated/schema'
import {
  getBalance, getDecimals, getToken,
} from '../entities'
import { getHolder } from '../entities/holder'
import { Bytes, ethereum } from '@graphprotocol/graph-ts'
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

	let ev         = new EventTransfer(event.address.toHexString())
	ev.emitter     = event.address
  ev.transaction = event.transaction.hash
	ev.timestamp   = event.block.timestamp.toBigDecimal()
	ev.contract    = event.address
	ev.value       = event.params.value.times(getDecimals().digits).toBigDecimal()
	ev.valueExact  = event.params.value.toBigDecimal()
  ev.from = event.params.from
  ev.to = event.params.to
  ev.save()
  const balance = getBalance(event.params.to)
  holder.balance = balance;
  holder.eventTransfer = ev.id
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
