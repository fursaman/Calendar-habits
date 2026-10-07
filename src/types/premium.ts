import type { DateKey } from './date'

export const PREMIUM_PLANS = ['monthly', 'yearly', 'lifetime'] as const
export type PremiumPlan = (typeof PREMIUM_PLANS)[number]

export type PremiumPurchase = {
  plan: PremiumPlan
  purchasedOn: DateKey
}

export type PremiumStatus = {
  /** First day of the free trial, set on first launch. */
  trialStartedOn: DateKey
  /** The active purchase, or null while on the trial or after it ends. */
  purchase: PremiumPurchase | null
}
