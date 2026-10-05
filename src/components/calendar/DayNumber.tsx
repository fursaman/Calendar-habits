import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const dayNumberVariants = cva(
  'inline-flex size-day-marker items-center justify-center rounded-pill text-date tabular-nums transition-[background-color,color] duration-standard',
  {
    variants: {
      state: {
        default: 'text-foreground',
        outside: 'text-faint-foreground',
        today: 'font-semibold text-today',
        selected: 'bg-foreground font-semibold text-background',
        todaySelected: 'bg-today font-semibold text-today-foreground',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export type DayNumberProps = {
  label: string
  isToday: boolean
  isSelected: boolean
  isOutside?: boolean
  className?: string
}

/**
 * The date numeral with its marker. Today is tinted, the selected day gets a
 * solid circle, and today-when-selected uses the today color, so the two
 * states are distinguishable without relying on color alone.
 */
export function DayNumber({
  label,
  isToday,
  isSelected,
  isOutside = false,
  className,
}: DayNumberProps) {
  const state =
    isSelected && isToday
      ? 'todaySelected'
      : isSelected
        ? 'selected'
        : isToday
          ? 'today'
          : isOutside
            ? 'outside'
            : 'default'
  return <span className={cn(dayNumberVariants({ state }), className)}>{label}</span>
}
