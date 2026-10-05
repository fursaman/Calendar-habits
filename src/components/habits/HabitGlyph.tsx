import { cva, type VariantProps } from 'class-variance-authority'
import type { CSSProperties } from 'react'

import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

import { HABIT_ICON_COMPONENTS } from './habit-icons'

const glyphVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-md bg-[color-mix(in_oklch,var(--habit)_14%,transparent)] text-(--habit)',
  {
    variants: {
      size: {
        sm: 'size-6 rounded-sm [&_svg]:size-3.5',
        md: 'size-8 [&_svg]:size-4.5',
        lg: 'size-10 rounded-lg [&_svg]:size-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type HabitGlyphProps = VariantProps<typeof glyphVariants> & {
  habit: Pick<Habit, 'color' | 'icon'>
  className?: string
}

/** The habit's icon on a soft tint of its color; a dot when it has no icon. */
export function HabitGlyph({ habit, size, className }: HabitGlyphProps) {
  const Icon = habit.icon ? HABIT_ICON_COMPONENTS[habit.icon] : null
  return (
    <span
      aria-hidden="true"
      className={cn(glyphVariants({ size }), className)}
      style={{ '--habit': habitColorVar(habit.color) } as CSSProperties}
    >
      {Icon ? <Icon strokeWidth={2} /> : <span className="size-2.5 rounded-pill bg-(--habit)" />}
    </span>
  )
}
