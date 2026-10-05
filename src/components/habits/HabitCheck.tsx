import { cva, type VariantProps } from 'class-variance-authority'
import type { CSSProperties } from 'react'

import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

const checkVariants = cva(
  'inline-flex shrink-0 animate-check-pop items-center justify-center rounded-pill bg-(--habit) text-on-habit',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type HabitCheckProps = VariantProps<typeof checkVariants> & {
  habit: Pick<Habit, 'color'>
  className?: string
}

/** A completed mark in the habit's color: the circle pops in, then the tick draws itself. */
export function HabitCheck({ habit, size, className }: HabitCheckProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(checkVariants({ size }), className)}
      style={{ '--habit': habitColorVar(habit.color) } as CSSProperties}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-3/4">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={3.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1}
          className="animate-check-draw"
        />
      </svg>
    </span>
  )
}
