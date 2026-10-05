import { isSameMonth } from 'date-fns'
import { type CSSProperties, memo, useMemo } from 'react'

import { useGridNavigation } from '@/hooks'
import {
  formatDayOfMonth,
  formatFullDate,
  formatMonth,
  formatWeekday,
  fromDateKey,
  getFixedMonthGridDays,
  getWeekdayReferenceDates,
  toDateKey,
} from '@/lib/calendar'
import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { CompletionMap, DateKey, Habit, Weekday } from '@/types'

export type MiniMonthProps = {
  month: Date
  weekStartsOn: Weekday
  today: DateKey
  /** When set, shades days by completion. */
  completions?: CompletionMap
  habits?: readonly Habit[]
  /** When set, days are buttons (date picker). Otherwise the grid is decorative. */
  onSelectDate?: (date: DateKey) => void
  selected?: DateKey
  showTitle?: boolean
  className?: string
}

/**
 * Compact month grid. In the year view it shades each day by how many of the
 * visible habits were completed; in the date picker its days are buttons.
 */
export const MiniMonth = memo(function MiniMonth({
  month,
  weekStartsOn,
  today,
  completions,
  habits = [],
  onSelectDate,
  selected,
  showTitle = true,
  className,
}: MiniMonthProps) {
  const days = useMemo(() => getFixedMonthGridDays(month, weekStartsOn), [month, weekStartsOn])
  const weekdays = useMemo(() => getWeekdayReferenceDates(weekStartsOn), [weekStartsOn])
  const onKeyDown = useGridNavigation()
  const interactive = !!onSelectDate
  const singleHabit = habits.length === 1 ? habits[0] : undefined

  function shade(key: DateKey): CSSProperties | undefined {
    if (!completions || habits.length === 0) return undefined
    const day = completions[key]
    if (!day) return undefined
    const done = habits.reduce((count, habit) => count + (day[habit.id] ? 1 : 0), 0)
    if (done === 0) return undefined
    // One habit: done days take its color. All habits: a quiet graphite wash
    // that deepens with each completed habit, and solid on perfect days.
    if (singleHabit) {
      return { backgroundColor: habitColorVar(singleHabit.color), color: 'var(--color-on-habit)' }
    }
    if (done === habits.length) {
      return {
        backgroundColor: 'color-mix(in oklch, var(--color-foreground) 72%, transparent)',
        color: 'var(--color-background)',
      }
    }
    const strength = Math.round(8 + (20 * done) / habits.length)
    return {
      backgroundColor: `color-mix(in oklch, var(--color-foreground) ${strength}%, transparent)`,
    }
  }

  return (
    <div className={className}>
      {showTitle && (
        <p
          className={cn(
            'mb-2 px-1 text-label font-semibold',
            isSameMonth(month, fromDateKey(today)) ? 'text-today' : 'text-foreground',
          )}
        >
          {formatMonth(month)}
        </p>
      )}
      <div className="grid grid-cols-7" aria-hidden={!interactive}>
        {weekdays.map((weekday) => (
          <span
            key={weekday.getDay()}
            className="pb-1 text-center text-date-sm text-faint-foreground uppercase"
            aria-hidden="true"
          >
            {formatWeekday(weekday, 'narrow')}
          </span>
        ))}
      </div>
      <div
        role={interactive ? 'grid' : undefined}
        aria-label={interactive ? formatMonth(month) : undefined}
        aria-hidden={!interactive}
        onKeyDown={interactive ? onKeyDown : undefined}
        className="grid grid-cols-7 gap-0.5"
      >
        {days.map((day) => {
          const key = toDateKey(day)
          const inMonth = isSameMonth(day, month)
          if (!inMonth) return <span key={key} className="aspect-square" />
          const isToday = key === today
          const isSelected = key === selected
          const content = formatDayOfMonth(day)
          const style = shade(key)

          const classes = cn(
            'mx-auto flex aspect-square w-full max-w-day-marker items-center justify-center rounded-pill tabular-nums',
            interactive ? 'text-label' : 'text-date-sm',
            isToday && !style && 'font-bold text-today',
            isSelected && 'bg-foreground font-semibold text-background',
            isSelected && isToday && 'bg-today text-today-foreground',
          )

          return interactive ? (
            <button
              key={key}
              type="button"
              data-grid-cell
              tabIndex={isSelected ? 0 : -1}
              aria-label={formatFullDate(day)}
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(key)}
              className={cn(classes, !isSelected && 'hover:bg-muted')}
            >
              {content}
            </button>
          ) : (
            <span key={key} className={classes} style={style}>
              {content}
            </span>
          )
        })}
      </div>
    </div>
  )
})
