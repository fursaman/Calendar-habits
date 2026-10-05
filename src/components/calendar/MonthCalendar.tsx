import { isSameMonth } from 'date-fns'
import { useMemo } from 'react'

import { useGridNavigation, useMonthGrid, useToday, useVisibleHabits } from '@/hooks'
import { formatMonthYear, toDateKey } from '@/lib/calendar'
import { getDay, getStreakLinks } from '@/lib/habits'
import { useAppActions, useAppState } from '@/state'

import { CalendarDayCell } from './CalendarDayCell'
import { WeekdayHeader } from './WeekdayHeader'

/** The default view: a full month with leading and trailing days. */
export function MonthCalendar({ date }: { date: Date }) {
  const { completions, activeDate, settings } = useAppState()
  const { selectDate } = useAppActions()
  const habits = useVisibleHabits()
  const today = useToday()
  const { weekStartsOn } = settings.calendar
  const weeks = useMonthGrid(date, weekStartsOn)
  const onKeyDown = useGridNavigation()
  const single = habits.length === 1 ? habits[0] : undefined
  const streaks = useMemo(
    () =>
      single ? getStreakLinks(completions, single.id, weeks.flat().map(toDateKey)) : undefined,
    [single, completions, weeks],
  )

  return (
    <div
      role="grid"
      tabIndex={-1}
      aria-label={formatMonthYear(date)}
      onKeyDown={onKeyDown}
      className="flex h-full flex-col"
    >
      <WeekdayHeader weekStartsOn={weekStartsOn} />
      <div
        role="rowgroup"
        className="grid flex-1 auto-rows-[minmax(var(--spacing-cell-min),1fr)] border-t border-border-subtle"
      >
        {weeks.map((week) => (
          <div
            key={toDateKey(week[0]!)}
            role="row"
            className="grid grid-cols-7 border-b border-border-subtle last:border-b-0"
          >
            {week.map((day) => {
              const key = toDateKey(day)
              return (
                <CalendarDayCell
                  key={key}
                  date={day}
                  dateKey={key}
                  day={getDay(completions, key)}
                  habits={habits}
                  isToday={key === today}
                  isSelected={key === activeDate}
                  isOutside={!isSameMonth(day, date)}
                  onSelect={selectDate}
                  joinsPrevious={streaks?.get(key)?.joinsPrevious}
                  joinsNext={streaks?.get(key)?.joinsNext}
                  streakLength={streaks?.get(key)?.length}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
