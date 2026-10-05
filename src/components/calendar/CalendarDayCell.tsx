import { memo } from 'react'

import { HabitDots } from '@/components/habits/HabitIndicator'
import { formatDayOfMonth } from '@/lib/calendar'
import { getCompletedHabits } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { DateKey, DayCompletions, Habit } from '@/types'

import { describeDay } from './day-label'
import { DayNumber } from './DayNumber'

export type CalendarDayCellProps = {
  date: Date
  dateKey: DateKey
  /** Stable per day: only changes when that day's completions change. */
  day: DayCompletions
  habits: readonly Habit[]
  isToday: boolean
  isSelected: boolean
  isOutside: boolean
  onSelect: (date: DateKey) => void
}

/** One day in the month grid. Memoized: toggling a habit re-renders only that day. */
export const CalendarDayCell = memo(function CalendarDayCell({
  date,
  dateKey,
  day,
  habits,
  isToday,
  isSelected,
  isOutside,
  onSelect,
}: CalendarDayCellProps) {
  const completed = getCompletedHabits(day, habits)

  return (
    <div role="gridcell" aria-selected={isSelected} className="min-w-0">
      <button
        type="button"
        data-grid-cell
        tabIndex={isSelected ? 0 : -1}
        aria-label={describeDay(date, completed, habits.length, isToday)}
        aria-current={isToday ? 'date' : undefined}
        onClick={() => onSelect(dateKey)}
        className={cn(
          'group flex size-full flex-col items-center gap-1 rounded-md pt-1 pb-2 outline-offset-[-2px]',
          'transition-colors duration-fast hover:bg-muted active:bg-surface-tertiary',
          'md:pt-2',
          isOutside && 'opacity-60',
        )}
      >
        <DayNumber
          label={formatDayOfMonth(date)}
          isToday={isToday}
          isSelected={isSelected}
          isOutside={isOutside}
        />
        <HabitDots habits={completed} />
      </button>
    </div>
  )
})
