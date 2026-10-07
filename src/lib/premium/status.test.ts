import { describe, expect, it } from 'vitest'

import type { DateKey } from '@/types'

import { createPremiumStatus, getPremiumState, getRenewalDate } from './status'

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d)

describe('getPremiumState', () => {
  const status = { trialStartedOn: '2026-10-05' as DateKey, purchase: null }

  it('starts a trial on the first launch day', () => {
    expect(createPremiumStatus(day(2026, 10, 5))).toEqual(status)
  })

  it('counts trial days including today', () => {
    const first = getPremiumState(status, day(2026, 10, 5))
    expect(first).toMatchObject({ kind: 'trial', dayIndex: 0, daysLeft: 7 })
    const third = getPremiumState(status, day(2026, 10, 7))
    expect(third).toMatchObject({ kind: 'trial', dayIndex: 2, daysLeft: 5 })
    expect(third.kind === 'trial' && third.endsOn).toEqual(day(2026, 10, 11))
    expect(getPremiumState(status, day(2026, 10, 11))).toMatchObject({ daysLeft: 1 })
  })

  it('expires the day after the last trial day', () => {
    expect(getPremiumState(status, day(2026, 10, 12))).toEqual({
      kind: 'expired',
      endedOn: day(2026, 10, 11),
    })
  })

  it('reports a purchase with its next renewal', () => {
    const bought = {
      ...status,
      purchase: { plan: 'yearly' as const, purchasedOn: '2026-10-07' as DateKey },
    }
    expect(getPremiumState(bought, day(2027, 3, 1))).toEqual({
      kind: 'premium',
      plan: 'yearly',
      renewsOn: day(2027, 10, 7),
    })
  })
})

describe('getRenewalDate', () => {
  it('rolls monthly renewals forward past today', () => {
    expect(getRenewalDate('monthly', day(2026, 10, 7), day(2026, 10, 7))).toEqual(day(2026, 11, 7))
    expect(getRenewalDate('monthly', day(2026, 10, 7), day(2026, 12, 7))).toEqual(day(2027, 1, 7))
  })

  it('never renews a lifetime purchase', () => {
    expect(getRenewalDate('lifetime', day(2026, 10, 7), day(2030, 1, 1))).toBeNull()
  })
})
