import type { CSSProperties } from 'react'

import { type HabitBalance, habitColorVar } from '@/lib/habits'

const SIZE = 176
const MAX_STROKE = 16
const GAP = 4

/**
 * Concentric progress rings, one per habit (outermost first), in the spirit
 * of activity rings: each closes as the habit approaches every possible day.
 */
export function HabitRings({ balance }: { balance: readonly HabitBalance[] }) {
  const stroke = Math.min(MAX_STROKE, (SIZE / 2 - 16) / Math.max(balance.length, 1) - GAP)

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="size-44 shrink-0 -rotate-90"
      role="img"
      aria-label={balance
        .map((item) => `${item.habit.name} ${Math.round(item.ratio * 100)}%`)
        .join(', ')}
    >
      {balance.map((item, index) => {
        const radius = SIZE / 2 - stroke / 2 - index * (stroke + GAP)
        const length = 2 * Math.PI * radius
        const color = habitColorVar(item.habit.color)
        return (
          <g key={item.habit.id}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              style={{ stroke: `color-mix(in oklch, ${color} 18%, transparent)` }}
            />
            {item.ratio > 0 && (
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={radius}
                fill="none"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - item.ratio)}
                className="animate-ring-fill"
                style={
                  {
                    stroke: color,
                    '--ring-length': `${length}px`,
                    animationDelay: `${index * 80}ms`,
                  } as CSSProperties
                }
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
