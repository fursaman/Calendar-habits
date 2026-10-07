import { RadioGroup } from 'radix-ui'

import { PLANS } from '@/lib/premium'
import type { PremiumPlan } from '@/types'
import { PREMIUM_PLANS } from '@/types'

export type PlanPickerProps = {
  value: PremiumPlan
  onValueChange: (plan: PremiumPlan) => void
}

/** Three plan tabs that always show their prices; a light pill slides to the chosen one. */
export function PlanPicker({ value, onValueChange }: PlanPickerProps) {
  const activeIndex = PREMIUM_PLANS.indexOf(value)
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onValueChange(next as PremiumPlan)}
      aria-label="Choose a plan"
      orientation="horizontal"
      className="relative isolate grid grid-cols-3 rounded-xl border border-premium-foreground/8 bg-premium-foreground/7 p-1"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 -z-10 w-[calc((100%-0.5rem)/3)] rounded-[calc(var(--radius-xl)-4px)] bg-premium-cta shadow-[0_6px_20px_-6px_color-mix(in_oklch,var(--color-premium-violet)_70%,transparent)] transition-transform duration-emphasized ease-pop"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {PREMIUM_PLANS.map((plan) => (
        <RadioGroup.Item
          key={plan}
          value={plan}
          className="group flex flex-col items-center gap-0.5 rounded-[calc(var(--radius-xl)-4px)] px-1 pt-2.5 pb-3 text-premium-foreground transition-colors duration-standard data-[state=checked]:text-premium-cta-foreground"
        >
          <span className="text-caption font-medium text-premium-foreground/60 transition-colors duration-standard group-data-[state=checked]:text-premium-cta-foreground/65">
            {PLANS[plan].name}
          </span>
          <span className="text-[1.1875rem] leading-tight font-bold tracking-[-0.03em] tabular-nums">
            {PLANS[plan].price}
          </span>
          <span className="text-[0.6875rem] text-premium-foreground/50 tabular-nums transition-colors duration-standard group-data-[state=checked]:text-premium-cta-foreground/65">
            {PLANS[plan].unit}
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
