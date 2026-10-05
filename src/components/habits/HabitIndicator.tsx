import { cva, type VariantProps } from 'class-variance-authority'
import { type CSSProperties, memo } from 'react'

import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

const indicatorVariants = cva('inline-block shrink-0 rounded-pill bg-(--habit)', {
  variants: {
    size: {
      sm: 'size-dot-sm',
      md: 'size-dot',
      lg: 'size-2.5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type HabitIndicatorProps = VariantProps<typeof indicatorVariants> & {
  habit: Pick<Habit, 'color'>
  className?: string
}

/** A small colored dot standing for one habit. Decorative; pair it with text or a label. */
export function HabitIndicator({ habit, size, className }: HabitIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(indicatorVariants({ size }), className)}
      style={{ '--habit': habitColorVar(habit.color) } as CSSProperties}
    />
  )
}

/** Visible dot limit before collapsing the rest into a "+N". */
const MAX_DOTS = 5

export type HabitDotsProps = {
  habits: readonly Habit[]
  size?: 'sm' | 'md'
  className?: string
}

/** Row of completion dots, in habit order. Renders nothing for an empty list. */
export const HabitDots = memo(function HabitDots({
  habits,
  size = 'md',
  className,
}: HabitDotsProps) {
  if (habits.length === 0) return null
  const overflow = habits.length > MAX_DOTS ? habits.length - (MAX_DOTS - 1) : 0
  const shown = overflow ? habits.slice(0, MAX_DOTS - 1) : habits

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex items-center justify-center',
        size === 'sm' ? 'gap-0.5' : 'gap-0.75',
        className,
      )}
    >
      {shown.map((habit) => (
        <HabitIndicator key={habit.id} habit={habit} size={size} className="animate-check" />
      ))}
      {overflow > 0 && <span className="text-date-sm text-muted-foreground">+{overflow}</span>}
    </span>
  )
})
