import type { PremiumPlan } from '@/types'

export type PlanInfo = {
  name: string
  price: string
  /** Short unit under the price on the plan tab. */
  unit: string
  /** One line under the plan tabs that explains the selected plan. */
  detail: string
  /** Renewal terms shown under the purchase button. */
  terms: string
}

export const PLANS: Record<PremiumPlan, PlanInfo> = {
  monthly: {
    name: 'Monthly',
    price: '$1.99',
    unit: 'per month',
    detail: 'Billed monthly. Cancel anytime.',
    terms: '$1.99 per month. Renews automatically until cancelled in Settings.',
  },
  yearly: {
    name: 'Yearly',
    price: '$16.99',
    unit: '$1.42 / mo',
    detail: '$16.99 billed once a year, 29% off monthly.',
    terms: '$16.99 per year. Renews automatically until cancelled in Settings.',
  },
  lifetime: {
    name: 'Lifetime',
    price: '$29.99',
    unit: 'one time',
    detail: 'Pay once and keep Premium forever.',
    terms: 'One-time purchase of $29.99. Nothing renews.',
  },
}

/** Preselected on the paywall: the best value for most people. */
export const DEFAULT_PLAN: PremiumPlan = 'yearly'

/**
 * Links Apple requires on screens that sell subscriptions. Terms use Apple's
 * standard EULA; the privacy policy is null until the app publishes one.
 */
export const LEGAL_URLS: { terms: string; privacy: string | null } = {
  terms: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacy: null,
}

/** Where people manage or cancel App Store subscriptions. */
export const MANAGE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions'
