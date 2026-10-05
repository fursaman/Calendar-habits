import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, CSSProperties } from 'react'

import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

import { HABIT_ICON_COMPONENTS } from './habit-icons'

const statusVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-pill transition-[background-color,color,box-shadow,transform] duration-standard ease-emphasized',
  {
    variants: {
      size: {
        sm: 'size-6 [&_svg]:size-3.5',
        md: 'size-8 [&_svg]:size-4',
        lg: 'size-10 [&_svg]:size-5',
      },
      completed: {
        true: 'bg-(--habit) text-on-habit',
        false: 'text-muted-foreground ring-1 ring-border ring-inset',
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
      className={cn(
        statusVariants({ size, completed }),
        completed && 'animate-check-pop',
        className,
      )}
      style={{ '--habit': habitColorVar(habit.color) } as CSSProperties}
    >
      {Icon ? <Icon strokeWidth={2.25} /> : null}
    </span>
  )
}

export type HabitToggleProps = Omit<ComponentProps<'button'>, 'children'> & {
  habit: Habit
  completed: boolean
  /** Accessible name, e.g. "Sport, Monday 5 October". */
  label: string
  size?: 'md' | 'lg'
  /** Show the habit name next to the icon; `'lg'` shows it only on large screens. */
  showName?: boolean | 'lg'
}

/** HabitStatus as a toggle button, for checking habits straight from the calendar. */
export function HabitToggle({
  habit,
  completed,
  label,
  size = 'lg',
  showName = false,
  className,
  ...props
}: HabitToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={completed}
      aria-label={label}
      className={cn(
        'group/toggle flex min-w-0 items-center gap-2 rounded-pill text-left disabled:cursor-default disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <HabitStatus
        habit={habit}
        completed={completed}
        size={size}
        className="group-enabled/toggle:group-hover/toggle:scale-105 group-enabled/toggle:group-active/toggle:scale-90"
      />
      {showName && (
        <span
          className={cn(
            'truncate text-caption',
            completed ? 'text-foreground' : 'text-muted-foreground',
            showName === 'lg' && 'hidden lg:inline',
          )}
        >
          {habit.name}
        </span>
      )}
    </button>
  )
}
