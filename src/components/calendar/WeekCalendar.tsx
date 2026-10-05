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
      // Phones: a table row on the shared column template. From `sm`: a day column.
      style={{ gridTemplateColumns: columnTemplate(habits.length) }}
      className={cn(
        'grid items-center rounded-lg px-1 py-1.5 transition-colors duration-fast',
        'sm:flex sm:h-full sm:flex-col sm:items-stretch sm:gap-3 sm:px-1.5 sm:py-2',
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
        className="flex shrink-0 flex-col items-center gap-1 rounded-md py-1 transition-colors duration-fast hover:bg-muted"
      >
        <span
          className={cn('text-weekday uppercase', isToday ? 'text-today' : 'text-muted-foreground')}
        >
          {formatWeekday(date, 'short')}
        </span>
        <DayNumber label={formatDayOfMonth(date)} isToday={isToday} isSelected={isSelected} />
      </button>
      <div
        className="contents sm:flex sm:flex-col sm:items-center sm:gap-2 lg:items-stretch"
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
              showName="lg"
              className="max-sm:justify-self-center"
            />
          )
        })}
      </div>
    </div>
  )
})

/** Phone layout: a date column, then one equal column per habit. */
function columnTemplate(habitCount: number) {
  return `3rem repeat(${habitCount}, minmax(0, 1fr))`
}

/**
 * Habit names as a sticky table header on phones. Every column has the same
 * width, so long names are truncated rather than pushing icons apart.
 */
function WeekHabitHeader({ habits }: { habits: readonly Habit[] }) {
  return (
    <div
      aria-hidden="true"
      style={{ gridTemplateColumns: columnTemplate(habits.length) }}
      className="sticky top-0 z-10 grid items-end bg-background/90 px-1 pt-1 pb-2 backdrop-blur-md sm:hidden"
    >
      <span />
      {habits.map((habit) => (
        <span
          key={habit.id}
          title={habit.name}
          className="truncate px-1 text-center text-caption font-medium text-muted-foreground"
        >
          {habit.name}
        </span>
      ))}
    </div>
  )
}

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
      className="grid h-full grid-cols-1 content-start gap-1 px-2 pb-2 sm:grid-cols-7 sm:content-stretch sm:gap-1.5 sm:px-3 sm:pt-2"
    >
      <WeekHabitHeader habits={habits} />
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
