
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
import { BigDecimal, Bytes, ethereum } from '@graphprotocol/graph-ts'
export function onTransfer(event: TransferEvent): void {
  const token = getToken()
  if (token === null) {
    return
  }
  // Force creation of users if not already known will be lazily created
  const holderFrom = getHolder(event.params.from)

  const holderTo = getHolder(event.params.to)
  // liquidity token amount being transfered
  // const value = event.params.value.divDecimal(BigDecimal.fromString('1e18'))

  let ev = new EventTransfer(event.transaction.hash.toHexString())

	ev.emitter     = event.address
  ev.transaction = event.transaction.hash
	ev.timestamp   = event.block.timestamp.toBigDecimal()
	ev.contract    = event.address
	ev.value       = event.params.value.times(getDecimals().times(BigDecimal.fromString('10')).digits).toBigDecimal()
	ev.valueExact  = event.params.value.toBigDecimal()
  ev.from = event.params.from
  ev.to = event.params.to
  ev.save()
  const balanceFrom = getBalance(event.params.from)
  const balanceTo = getBalance(event.params.to)
  holderFrom.balance = balanceFrom;
  holderTo.balance = balanceTo;
  if (!holderFrom.eventsTransfer.includes(ev.id)) {
      const holderFromEventsTransfer = holderFrom.eventsTransfer
      holderFromEventsTransfer.push(event.transaction.hash.toHexString())
      holderFrom.eventsTransfer = holderFromEventsTransfer
  }
  if (!holderTo.eventsTransfer.includes(ev.id)) {
    let holderToEventsTransfer = holderTo.eventsTransfer
    holderToEventsTransfer.push(event.transaction.hash.toHexString())
    holderTo.eventsTransfer = holderToEventsTransfer
  }
  
  holderFrom.save();
  holderTo.save();
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
