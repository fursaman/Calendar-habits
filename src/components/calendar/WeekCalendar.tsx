import { memo } from 'react'

import { HabitStatus } from '@/components/habits/HabitStatus'
import { useGridNavigation, useToday, useVisibleHabits, useWeekDays } from '@/hooks'
import { formatDayOfMonth, formatPeriod, formatWeekday, toDateKey } from '@/lib/calendar'
import { getCompletedHabits, getDay } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'
import type { DateKey, DayCompletions, Habit } from '@/types'

import { describeDay } from './day-label'
import { DayNumber } from './DayNumber'

type WeekDayProps = {
  date: Date
  dateKey: DateKey
  day: DayCompletions
  habits: readonly Habit[]
  isToday: boolean
  isSelected: boolean
  onSelect: (date: DateKey) => void
}

/**
 * One day of the week. A row on phones (date on the left, habits on the
 * right) and a column from `sm` up, so seven days fit without overflow.
 */
const WeekDay = memo(function WeekDay({
  date,
  dateKey,
  day,
  habits,
  isToday,
  isSelected,
  onSelect,
}: WeekDayProps) {
  const completed = getCompletedHabits(day, habits)
  return (
    <button
      type="button"
      data-grid-cell
      tabIndex={isSelected ? 0 : -1}
      aria-pressed={isSelected}
      aria-current={isToday ? 'date' : undefined}
      aria-label={describeDay(date, completed, habits.length, isToday)}
      onClick={() => onSelect(dateKey)}
      className={cn(
        'flex items-center gap-4 rounded-lg px-3 py-2.5 text-left outline-offset-[-2px]',
        'transition-colors duration-fast hover:bg-muted active:bg-surface-tertiary',
        'sm:h-full sm:flex-col sm:items-stretch sm:gap-3 sm:px-2 sm:py-3',
        isSelected && 'bg-muted',
      )}
    >
      <span className="flex w-12 shrink-0 flex-col items-center gap-1 sm:w-auto">
        <span
          className={cn('text-weekday uppercase', isToday ? 'text-today' : 'text-muted-foreground')}
        >
          {formatWeekday(date, 'short')}
        </span>
        <DayNumber label={formatDayOfMonth(date)} isToday={isToday} isSelected={isSelected} />
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:flex-none sm:flex-col sm:items-stretch sm:gap-1">
        {habits.map((habit) => (
          <span
            key={habit.id}
            className="flex min-w-0 items-center gap-2 sm:rounded-md sm:px-1 sm:py-0.5"
          >
            <HabitStatus habit={habit} completed={day[habit.id] === true} />
            <span
              className={cn(
                'hidden truncate text-caption lg:inline',
                day[habit.id] ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {habit.name}
            </span>
          </span>
        ))}
      </span>
    </button>
  )
})

/** Seven days with each habit's state, for a closer look than the month grid. */
export function WeekCalendar({ date }: { date: Date }) {
  const { completions, activeDate, settings } = useAppState()
  const { selectDate } = useAppActions()
  const habits = useVisibleHabits()
  const today = useToday()
  const { weekStartsOn } = settings.calendar
  const days = useWeekDays(date, weekStartsOn)
  const onKeyDown = useGridNavigation()

  return (
    // Arrow keys move focus between the day buttons inside.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      aria-label={formatPeriod(date, 'week', weekStartsOn)}
      onKeyDown={onKeyDown}
      className="grid h-full grid-cols-1 content-start gap-1 px-2 py-2 sm:grid-cols-7 sm:content-stretch sm:gap-1.5 sm:px-3"
    >
      {days.map((day) => {
        const key = toDateKey(day)
        return (
          <WeekDay
            key={key}
            date={day}
            dateKey={key}
            day={getDay(completions, key)}
            habits={habits}
            isToday={key === today}
            isSelected={key === activeDate}
            onSelect={selectDate}
          />
        )
      })}
    </div>
  )
}
