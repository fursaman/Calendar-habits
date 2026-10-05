import { setMonth } from 'date-fns'

import { useToday, useVisibleHabits, useYearMonths } from '@/hooks'
import { formatMonthYear, toDateKey } from '@/lib/calendar'
import { useAppActions, useAppState } from '@/state'

import { MiniMonth } from './MiniMonth'

/** Twelve mini months, shaded by consistency. Choosing a month opens it in Month view. */
export function YearCalendar({ date }: { date: Date }) {
  const { completions, settings } = useAppState()
  const { setView } = useAppActions()
  const habits = useVisibleHabits()
  const today = useToday()
  const months = useYearMonths(date)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 py-4 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-8 lg:px-6">
      {months.map((month) => (
        <button
          key={month.getMonth()}
          type="button"
          aria-label={`Open ${formatMonthYear(month)}`}
          // Keep the day of month when jumping, clamped to the month's length.
          onClick={() => setView('month', toDateKey(setMonth(date, month.getMonth())))}
          className="rounded-lg p-2 text-left transition-colors duration-fast hover:bg-muted active:bg-surface-tertiary"
        >
          <MiniMonth
            month={month}
            weekStartsOn={settings.calendar.weekStartsOn}
            today={today}
            completions={completions}
            habits={habits}
          />
        </button>
      ))}
    </div>
  )
}
