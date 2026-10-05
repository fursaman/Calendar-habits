import { Flame } from 'lucide-react'

import { cn } from '@/lib/utils'

const GRADIENT_ID = 'streak-gradient'

/** Gradient used by streak flames. Render once near the root. */
export function StreakGradient() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-streak-from)" />
          <stop offset="100%" stopColor="var(--color-streak-to)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/** A gradient flame with the streak length, e.g. "🔥 5". */
export function StreakBadge({ days, className }: { days: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex animate-check-pop items-center gap-0.5 text-caption font-semibold text-foreground tabular-nums',
        className,
      )}
    >
      <Flame
        aria-hidden="true"
        className="size-3.5"
        fill={`url(#${GRADIENT_ID})`}
        stroke={`url(#${GRADIENT_ID})`}
      />
      {days}
      <span className="sr-only"> day streak</span>
    </span>
  )
}
