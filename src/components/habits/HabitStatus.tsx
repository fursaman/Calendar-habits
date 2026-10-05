import { cva, type VariantProps } from 'class-variance-authority'
import type { CSSProperties } from 'react'

import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

import { HABIT_ICON_COMPONENTS } from './habit-icons'

const statusVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-pill transition-[background-color,color,box-shadow] duration-standard',
  {
    variants: {
      size: {
        sm: 'size-5 [&_svg]:size-3',
        md: 'size-6 [&_svg]:size-3.5',
      },
      completed: {
        true: 'bg-(--habit) text-on-habit',
        false: 'text-faint-foreground ring-1 ring-border ring-inset',
      },
    },
    defaultVariants: { size: 'md', completed: false },
  },
)

export type HabitStatusProps = VariantProps<typeof statusVariants> & {
  habit: Habit
  completed: boolean
  className?: string
}

/**
 * A habit's done/not-done state for one day: filled with the habit color when
 * done, an empty outline when not. The icon keeps habits distinguishable
 * without relying on color.
 */
export function HabitStatus({ habit, completed, size, className }: HabitStatusProps) {
  const Icon = habit.icon ? HABIT_ICON_COMPONENTS[habit.icon] : null
  return (
    <span
      aria-hidden="true"
      className={cn(statusVariants({ size, completed }), className)}
      style={{ '--habit': habitColorVar(habit.color) } as CSSProperties}
    >
      {Icon ? <Icon strokeWidth={2.25} /> : null}
    </span>
  )
}
