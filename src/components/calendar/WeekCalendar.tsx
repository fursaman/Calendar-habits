import { useRef } from 'react'

import { HabitToggle } from '@/components/habits/HabitStatus'
import {
  SWIPE_IGNORE_ATTRIBUTE,
  useGridNavigation,
  useHorizontalOverflow,
  useMediaQuery,
  useToday,
  useToggleHabit,
  useVisibleHabits,
  useWeekDays,
} from '@/hooks'
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

/** Matches Tailwind's `sm` breakpoint, where the week turns into seven columns. */
const SM_QUERY = '(min-width: 40rem)'

type DayState = {
  date: Date
  dateKey: DateKey
  day: DayCompletions
  isToday: boolean
  isSelected: boolean
  isFuture: boolean
}

type WeekLayoutProps = {
  days: readonly DayState[]
  habits: readonly Habit[]
  onSelect: (date: DateKey) => void
  onToggle: (date: DateKey, habitId: HabitId) => void
}

/** The date button that selects a day. */
function DayButton({
  date,
  dateKey,
  day,
  habits,
  isToday,
  isSelected,
  onSelect,
}: DayState & Pick<WeekLayoutProps, 'habits' | 'onSelect'>) {
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
      className="flex shrink-0 flex-col items-center gap-1 rounded-md py-1 transition-colors duration-fast hover:bg-muted"
    >
      <span
        className={cn('text-weekday uppercase', isToday ? 'text-today' : 'text-muted-foreground')}
      >
        {formatWeekday(date, 'short')}
      </span>
      <DayNumber label={formatDayOfMonth(date)} isToday={isToday} isSelected={isSelected} />
    </button>
  )
}

/** One toggle per habit for a day; future days can't be checked off yet. */
function DayHabits({
  date,
  dateKey,
  day,
  isFuture,
  habits,
  onToggle,
}: DayState & Pick<WeekLayoutProps, 'habits' | 'onToggle'>) {
  const shortDate = formatShortDate(date)
  return habits.map((habit) => {
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
        className="shrink-0"
      />
    )
  })
}

const FUTURE_HINT = 'You can mark habits for this day once it arrives'

/** Phone row height, shared by the date column and the habit rows so they line up. */
const PHONE_ROW = 'h-16'

/**
 * Phones: a table with the dates in a fixed column on the left and the habits
 * left-aligned beside them. When there are more habits than fit, the habit
 * columns scroll sideways together while the dates stay put.
 */
function PhoneWeek({ days, habits, onSelect, onToggle }: WeekLayoutProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const overflowing = useHorizontalOverflow(scrollerRef)

  return (
    <div className="flex px-2 pb-2">
      <div className="flex shrink-0 flex-col">
        <div aria-hidden="true" className="h-7" />
        {days.map((state) => (
          <div
            key={state.dateKey}
            className={cn(
              'flex w-12 items-center justify-center rounded-l-lg transition-colors duration-fast',
              PHONE_ROW,
              state.isSelected && 'bg-muted',
            )}
          >
            <DayButton {...state} habits={habits} onSelect={onSelect} />
          </div>
        ))}
      </div>
      <div
        ref={scrollerRef}
        // Sideways swipes scroll the habits here instead of switching views.
        {...(overflowing ? { [SWIPE_IGNORE_ATTRIBUTE]: '' } : {})}
        className={cn(
          'scrollbar-none min-w-0 flex-1 overflow-x-auto overscroll-x-contain',
          overflowing ? 'touch-pan-x touch-pan-y' : 'touch-pan-y',
        )}
      >
        <div className="w-max min-w-full">
          <div aria-hidden="true" className="flex h-7 items-end gap-5 px-2 pb-1.5">
            {habits.map((habit) => (
              <span
                key={habit.id}
                title={habit.name}
                // As wide as the icon plus the gap, so names have room without spreading icons.
                className="-mx-2.5 w-15 shrink-0 truncate px-0.5 text-center text-caption font-medium text-muted-foreground"
              >
                {habit.name}
              </span>
            ))}
          </div>
          {days.map((state) => (
            <div
              key={state.dateKey}
              title={state.isFuture ? FUTURE_HINT : undefined}
              className={cn(
                'flex items-center gap-5 rounded-r-lg px-2 transition-colors duration-fast',
                PHONE_ROW,
                state.isSelected && 'bg-muted',
              )}
            >
              <DayHabits {...state} habits={habits} onToggle={onToggle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** From `sm` up: seven day columns, each with its habits stacked below the date. */
function ColumnWeek({ days, habits, onSelect, onToggle }: WeekLayoutProps) {
  return (
    <div className="grid h-full grid-cols-7 gap-1.5 px-3 pt-2 pb-2">
      {days.map((state) => (
        <div
          key={state.dateKey}
          className={cn(
            'flex h-full flex-col gap-3 rounded-lg px-1.5 py-2 transition-colors duration-fast',
            state.isSelected && 'bg-muted',
          )}
        >
          <DayButton {...state} habits={habits} onSelect={onSelect} />
          <div
            className="flex flex-col items-center gap-2 lg:items-stretch"
            title={state.isFuture ? FUTURE_HINT : undefined}
          >
            <DayHabits {...state} habits={habits} onToggle={onToggle} />
          </div>
        </div>
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
  const weekDays = useWeekDays(date, weekStartsOn)
  const onKeyDown = useGridNavigation()
  const isPhone = !useMediaQuery(SM_QUERY)

  const days = weekDays.map((day): DayState => {
    const key = toDateKey(day)
    return {
      date: day,
      dateKey: key,
      day: getDay(completions, key),
      isToday: key === today,
      isSelected: key === activeDate,
      isFuture: key > today,
    }
  })
  const Layout = isPhone ? PhoneWeek : ColumnWeek

  return (
    // Arrow keys move focus between the day buttons inside.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      aria-label={`Week of ${formatFullDate(weekDays[0]!)}, ${formatPeriod(date, 'week', weekStartsOn)}`}
      onKeyDown={onKeyDown}
      className="h-full"
    >
      <Layout days={days} habits={habits} onSelect={selectDate} onToggle={toggleHabit} />
    </div>
  )
}
