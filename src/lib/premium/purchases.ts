import { todayKey } from '@/lib/calendar'
import type { PremiumPlan, PremiumPurchase } from '@/types'

/**
 * The only store API the app depends on, in the same spirit as AppRepository:
 * a native StoreKit or RevenueCat implementation can replace the local one
 * without changing callers.
 */
export type PurchaseService = {
  purchase(plan: PremiumPlan): Promise<PremiumPurchase>
  /** Returns the user's previous purchase, or null when there is none. */
  restore(): Promise<PremiumPurchase | null>
}

/**
 * On-device implementation used until a payment provider is connected. It
 * grants the chosen plan immediately and has no purchase history to restore.
 */
export function createLocalPurchaseService(now: () => Date = () => new Date()): PurchaseService {
  return {
    purchase: async (plan) => ({ plan, purchasedOn: todayKey(now()) }),
    restore: async () => null,
  }
}
