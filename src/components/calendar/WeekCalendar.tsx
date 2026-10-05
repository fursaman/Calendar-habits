import { memo } from 'react'

import { HabitToggle } from '@/components/habits/HabitStatus'
import { useGridNavigation, useToday, useToggleHabit, useVisibleHabits, useWeekDays } from '@/hooks'
import {
  formatDayOfMonth,
  formatFullDate,
  formatPeriod,
  formatShortDate,
  formatWeekday,
  toDateKey,
} from '@/lib/calendar'
import { getCompletedHabits, getDay } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'
import type { DateKey, DayCompletions, Habit, HabitId } from '@/types'

import { describeDay } from './day-label'
import { DayNumber } from './DayNumber'

type WeekDayProps = {
  date: Date
  dateKey: DateKey
  day: DayCompletions
  habits: readonly Habit[]
  isToday: boolean
  isSelected: boolean
  isFuture: boolean
  onSelect: (date: DateKey) => void
  onToggle: (date: DateKey, habitId: HabitId) => void
}

/**
 * One day of the week. A row on phones (date on the left, habits on the
 * right) and a column from `sm` up, so seven days fit without overflow.
 * The date selects the day; each habit icon checks it off directly.
 */
const WeekDay = memo(function WeekDay({
  date,
  dateKey,
  day,
  habits,
  isToday,
  isSelected,
  isFuture,
  onSelect,
  onToggle,
}: WeekDayProps) {
  const completed = getCompletedHabits(day, habits)
  const shortDate = formatShortDate(date)

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-fast',
        'sm:h-full sm:flex-col sm:items-stretch sm:gap-3 sm:px-1.5 sm:py-2',
        isSelected && 'bg-muted',
      )}
    >
      <button
        type="button"
        data-grid-cell
        tabIndex={isSelected ? 0 : -1}
        aria-pressed={isSelected}
        aria-current={isToday ? 'date' : undefined}
        aria-label={describeDay(date, completed, habits.length, isToday)}
        onClick={() => onSelect(dateKey)}
        className="flex w-12 shrink-0 flex-col items-center gap-1 rounded-md py-1 transition-colors duration-fast hover:bg-muted sm:w-auto"
      >
        <span
          className={cn('text-weekday uppercase', isToday ? 'text-today' : 'text-muted-foreground')}
        >
          {formatWeekday(date, 'short')}
        </span>
        <DayNumber label={formatDayOfMonth(date)} isToday={isToday} isSelected={isSelected} />
      </button>
      <div
        className="flex min-w-0 flex-1 items-start gap-1 sm:flex-none sm:flex-col sm:items-center sm:gap-2 lg:items-stretch"
        title={isFuture ? 'You can mark habits for this day once it arrives' : undefined}
      >
        {habits.map((habit) => {
          const done = day[habit.id] === true
          return (
            <HabitToggle
              key={habit.id}
              habit={habit}
              completed={done}
              disabled={isFuture}
              label={`${habit.name}, ${shortDate}${done ? ', completed' : ''}`}
              onClick={() => onToggle(dateKey, habit.id)}
              showName={isSelected ? 'below' : 'lg'}
              // Fixed width on phones keeps icons in the same columns on every row.
              className="max-sm:w-16"
            />
          )
        })}
      </div>
    </div>
  )
})

/** Seven days with every habit, each checkable in one tap. */
export function WeekCalendar({ date }: { date: Date }) {
  const { completions, activeDate, settings } = useAppState()
  const { selectDate } = useAppActions()
  const toggleHabit = useToggleHabit()
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
      aria-label={`Week of ${formatFullDate(days[0]!)}, ${formatPeriod(date, 'week', weekStartsOn)}`}
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
            isFuture={key > today}
            onSelect={selectDate}
            onToggle={toggleHabit}
          />
        )
      })}
    </div>
  )
}
