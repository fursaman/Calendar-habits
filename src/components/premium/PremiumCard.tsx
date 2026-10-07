import { Check } from 'lucide-react'
import { useMemo } from 'react'

import { useToday } from '@/hooks'
import { formatMonthDayShort, fromDateKey } from '@/lib/calendar'
import {
  getPremiumState,
  MANAGE_SUBSCRIPTIONS_URL,
  PLANS,
  type PremiumState,
  TRIAL_DAYS,
} from '@/lib/premium'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'

import { PremiumAura } from './PremiumAura'
import { PremiumButton } from './PremiumButton'

/**
 * Top of Settings: the trial countdown with a way to unlock Premium, which
 * shrinks to a quiet status row once Premium is active.
 */
export function PremiumCard() {
  const { premium } = useAppState()
  const today = useToday()
  const state = useMemo(() => getPremiumState(premium, fromDateKey(today)), [premium, today])

  return (
    <section
      aria-label="Premium"
      className="relative isolate overflow-hidden rounded-[1.75rem] bg-premium p-4 text-premium-foreground shadow-[0_0_0_4px_oklch(0_0_0/0.12)]"
    >
      <PremiumAura variant="card" />
      {state.kind === 'premium' ? <ActivePremium state={state} /> : <TrialOffer state={state} />}
    </section>
  )
}

function TrialOffer({ state }: { state: Exclude<PremiumState, { kind: 'premium' }> }) {
  const { setPaywallOpen } = useAppActions()
  const trial = state.kind === 'trial' ? state : null
  const lastDay = trial?.daysLeft === 1

  const pill = !trial ? 'Trial ended' : lastDay ? 'Ends today' : `${trial.daysLeft} days left`
  const copy = !trial
    ? 'Your habits and history are safe. Unlock Premium to bring every feature back.'
    : lastDay
      ? 'Your free week ends tonight. Unlock Premium to keep everything you have now.'
      : 'You are enjoying Premium for free. Pick a plan any time to keep it all.'

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-title font-bold tracking-[-0.02em]">
          {trial ? 'Premium trial' : 'Premium'}
        </h3>
        <span className="rounded-pill border border-premium-foreground/18 bg-premium-foreground/14 px-2.5 py-1 text-caption font-semibold whitespace-nowrap tabular-nums">
          {pill}
        </span>
      </div>
      {trial && (
        <div className="space-y-1.5">
          <div
            role="img"
            aria-label={`Day ${trial.dayIndex + 1} of ${TRIAL_DAYS}`}
            className="grid grid-cols-7 gap-1.25"
          >
            {Array.from({ length: TRIAL_DAYS }, (_, day) => (
              <span
                key={day}
                className={cn(
                  'h-1.25 rounded-pill',
                  day < trial.dayIndex && 'bg-premium-foreground/85',
                  day > trial.dayIndex && 'bg-premium-foreground/18',
                  day === trial.dayIndex &&
                    'animate-shimmer bg-[linear-gradient(90deg,var(--color-premium-pink),var(--color-premium-violet),var(--color-premium-blue),var(--color-premium-pink))] bg-size-[200%_100%]',
                )}
              />
            ))}
          </div>
          <div className="flex justify-between text-[0.6875rem] text-premium-foreground/55 tabular-nums">
            <span>Started {formatMonthDayShort(trial.startedOn)}</span>
            <span>{lastDay ? 'Ends tonight' : `Ends ${formatMonthDayShort(trial.endsOn)}`}</span>
          </div>
        </div>
      )}
      <p className="text-body text-premium-foreground/80">{copy}</p>
      <PremiumButton size="md" onClick={() => setPaywallOpen(true)}>
        Unlock Premium
      </PremiumButton>
    </div>
  )
}

function ActivePremium({ state }: { state: Extract<PremiumState, { kind: 'premium' }> }) {
  const plan = PLANS[state.plan].name
  const summary = state.renewsOn
    ? `${plan}, renews ${formatMonthDayShort(state.renewsOn)}`
    : `${plan}, yours forever`
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-8.5 shrink-0 place-items-center rounded-[0.6875rem] bg-[linear-gradient(135deg,var(--color-premium-pink),var(--color-premium-violet),var(--color-premium-blue))]">
        <Check aria-hidden="true" className="size-4" strokeWidth={2.6} />
      </span>
      <div className="min-w-0">
        <h3 className="text-body font-semibold">Premium</h3>
        <p className="text-caption text-premium-foreground/62">{summary}</p>
      </div>
      {state.renewsOn && (
        <a
          href={MANAGE_SUBSCRIPTIONS_URL}
          target="_blank"
          rel="noreferrer"
          className="ml-auto rounded-pill bg-premium-foreground/14 px-3.5 py-2 text-label font-semibold hover:bg-premium-foreground/22"
        >
          Manage
        </a>
      )}
    </div>
  )
}
