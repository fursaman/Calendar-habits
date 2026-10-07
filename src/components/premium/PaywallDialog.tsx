import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { useEffect, useState } from 'react'

import { Dialog, IconButton } from '@/components/ui'
import { modalContentClassName, overlayClassName } from '@/components/ui/overlay'
import { createLocalPurchaseService, DEFAULT_PLAN, LEGAL_URLS, PLANS } from '@/lib/premium'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'
import type { PremiumPlan } from '@/types'

import { PlanPicker } from './PlanPicker'
import { PremiumAura } from './PremiumAura'
import { PremiumButton } from './PremiumButton'
import { ReviewCarousel } from './ReviewCarousel'

// Swap this for a StoreKit or RevenueCat PurchaseService later; the UI doesn't change.
const purchases = createLocalPurchaseService()

const NOTICE_MS = 3000

export function PaywallDialog() {
  const { paywallOpen } = useAppState()
  const { setPaywallOpen } = useAppActions()
  return (
    <Dialog open={paywallOpen} onOpenChange={setPaywallOpen}>
      {paywallOpen && <PaywallContent />}
    </Dialog>
  )
}

/** Mounted per opening, so it always starts on the default plan. */
function PaywallContent() {
  const { recordPurchase } = useAppActions()
  const [plan, setPlan] = useState<PremiumPlan>(DEFAULT_PLAN)
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), NOTICE_MS)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function purchase() {
    setPending(true)
    try {
      recordPurchase(await purchases.purchase(plan))
    } catch {
      setNotice('The purchase did not go through. Please try again.')
    } finally {
      setPending(false)
    }
  }

  async function restore() {
    const previous = await purchases.restore()
    if (previous) recordPurchase(previous)
    else setNotice('No previous purchases to restore.')
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          modalContentClassName,
          'isolate overflow-hidden rounded-t-[2rem] bg-premium text-premium-foreground sm:max-w-[26rem] sm:rounded-[2rem]',
        )}
      >
        <PremiumAura />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-4 pb-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={restore}
              className="rounded-md px-1 py-1.5 text-body font-medium text-premium-foreground/75 hover:text-premium-foreground"
            >
              Restore
            </button>
            <DialogPrimitive.Close asChild>
              <IconButton
                icon={<X />}
                label="Close"
                size="sm"
                className="bg-premium-foreground/16 text-premium-foreground hover:bg-premium-foreground/24"
              />
            </DialogPrimitive.Close>
          </div>

          <header className="mx-auto mt-5 max-w-72 space-y-2.5 text-center">
            <DialogPrimitive.Title className="text-[1.9375rem] leading-[1.08] font-bold tracking-[-0.035em] text-balance">
              Your habits, without limits.
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-body text-premium-foreground/68">
              Unlimited habits and your whole year of progress in one calm view.
            </DialogPrimitive.Description>
          </header>

          <div className="mt-6">
            <ReviewCarousel />
          </div>
          <div className="mt-5.5">
            <PlanPicker value={plan} onValueChange={setPlan} />
          </div>
          {/* Fixed heights below keep the button in place when the plan changes. */}
          <p
            aria-live="polite"
            className="mt-3 h-5 text-center text-label text-premium-foreground/72"
          >
            {notice ?? PLANS[plan].detail}
          </p>

          <div className="mt-auto space-y-2 pt-4">
            <PremiumButton onClick={purchase} disabled={pending}>
              Unlock Premium
            </PremiumButton>
            <p className="flex h-8 items-center justify-center text-center text-[0.6875rem] leading-snug text-premium-foreground/45">
              {PLANS[plan].terms}
            </p>
            <div className="flex justify-center gap-4 text-[0.6875rem] text-premium-foreground/55">
              <a
                href={LEGAL_URLS.terms}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Terms of Use
              </a>
              {LEGAL_URLS.privacy ? (
                <a
                  href={LEGAL_URLS.privacy}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  Privacy Policy
                </a>
              ) : (
                <span>Privacy Policy</span>
              )}
            </div>
          </div>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
