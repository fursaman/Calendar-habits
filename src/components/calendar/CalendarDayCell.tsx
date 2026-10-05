import { type CSSProperties, memo } from 'react'

import { HabitCheck } from '@/components/habits/HabitCheck'
import { HabitDots } from '@/components/habits/HabitIndicator'
import { StreakBadge } from '@/components/habits/StreakBadge'
import { formatDayOfMonth } from '@/lib/calendar'
import { getCompletedHabits, habitColorVar } from '@/lib/habits'
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
  /** Single-habit view: streak line joins and the length at a streak's end. */
  joinsPrevious?: boolean
  joinsNext?: boolean
  streakLength?: number
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
  joinsPrevious = false,
  joinsNext = false,
  streakLength,
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
        {/* One habit in focus: a colored check. Several: a compact row of dots. */}
        {habits.length === 1 ? (
          completed[0] && (
            <>
              <span className="relative flex w-full justify-center">
                {/* Streak line through consecutive completed days. */}
                {(joinsPrevious || joinsNext) && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1/2 h-1.5 -translate-y-1/2 bg-[color-mix(in_oklch,var(--habit)_35%,transparent)]',
                      joinsPrevious ? 'left-0' : 'left-1/2',
                      joinsNext ? 'right-0' : 'right-1/2',
                    )}
                    style={{ '--habit': habitColorVar(completed[0].color) } as CSSProperties}
                  />
                )}
                <HabitCheck habit={completed[0]} className="relative lg:size-6" />
              </span>
              {streakLength !== undefined && <StreakBadge days={streakLength} />}
            </>
          )
        ) : (
          <HabitDots habits={completed} />
        )}
      </button>
    </div>
  )
})
