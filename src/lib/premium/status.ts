import { addDays, addMonths, addYears, differenceInCalendarDays } from 'date-fns'

import { fromDateKey, toDateKey } from '@/lib/calendar'
import type { PremiumPlan, PremiumStatus } from '@/types'

export const TRIAL_DAYS = 7

export type PremiumState =
  | {
      kind: 'trial'
      /** Zero-based day of the trial that today falls on. */
      dayIndex: number
      /** Days left including today. */
      daysLeft: number
      startedOn: Date
      /** The last day of the trial. */
      endsOn: Date
    }
  | { kind: 'expired'; endedOn: Date }
  | { kind: 'premium'; plan: PremiumPlan; renewsOn: Date | null }

/** A fresh trial that starts today. */
export function createPremiumStatus(now: Date = new Date()): PremiumStatus {
  return { trialStartedOn: toDateKey(now), purchase: null }
}

/** Next renewal strictly after today, or null for a one-time purchase. */
export function getRenewalDate(plan: PremiumPlan, purchasedOn: Date, today: Date): Date | null {
  if (plan === 'lifetime') return null
  const step = plan === 'monthly' ? addMonths : addYears
  let periods = 1
  let next = step(purchasedOn, periods)
  while (differenceInCalendarDays(next, today) <= 0) next = step(purchasedOn, ++periods)
  return next
}

export function getPremiumState(status: PremiumStatus, today: Date): PremiumState {
  if (status.purchase) {
    const { plan, purchasedOn } = status.purchase
    return {
      kind: 'premium',
      plan,
      renewsOn: getRenewalDate(plan, fromDateKey(purchasedOn), today),
    }
  }
  const startedOn = fromDateKey(status.trialStartedOn)
  const endsOn = addDays(startedOn, TRIAL_DAYS - 1)
  const dayIndex = Math.max(0, differenceInCalendarDays(today, startedOn))
  if (dayIndex >= TRIAL_DAYS) return { kind: 'expired', endedOn: endsOn }
  return { kind: 'trial', dayIndex, daysLeft: TRIAL_DAYS - dayIndex, startedOn, endsOn }
}
