import { HabitChecklist } from '@/components/habits/HabitChecklist'
import { useToday } from '@/hooks'
import {
  formatMonthDay,
  formatRelativeDay,
  formatWeekday,
  fromDateKey,
  toDateKey,
} from '@/lib/calendar'
import { getCompletedHabits, getDay, habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppState } from '@/state'

/** A focused, distraction-free checklist for a single day. */
export function DayCalendar({ date }: { date: Date }) {
  const { habits, completions } = useAppState()
  const today = useToday()
  const key = toDateKey(date)
  const completed = getCompletedHabits(getDay(completions, key), habits)
  const relative = formatRelativeDay(date, fromDateKey(today), () => formatWeekday(date, 'long'))
  const allDone = habits.length > 0 && completed.length === habits.length

  return (
    <div className="mx-auto w-full max-w-dialog px-4 py-6 sm:py-10">
      <header className="px-3 pb-6">
        <p className={cn('text-label', key === today ? 'text-today' : 'text-muted-foreground')}>
          {relative}
        </p>
        <h2 className="text-display">{formatMonthDay(date)}</h2>
        {habits.length > 0 && (
          <div className="mt-4 space-y-2">
            {/* Segmented progress: one segment per habit, filled in its color when done. */}
            <div className="flex gap-1" aria-hidden="true">
              {habits.map((habit) => (
                <span
                  key={habit.id}
                  className="h-1 flex-1 rounded-pill bg-surface-tertiary transition-colors duration-emphasized"
                  style={
                    completed.includes(habit)
                      ? { backgroundColor: habitColorVar(habit.color) }
                      : undefined
                  }
                />
              ))}
            </div>
            <p
              className={cn(
                'text-label tabular-nums',
                allDone ? 'text-success' : 'text-muted-foreground',
              )}
            >
              {allDone
                ? 'All habits completed'
                : `${completed.length} of ${habits.length} completed`}
            </p>
          </div>
        )}
      </header>
      <HabitChecklist date={key} size="lg" showStreaks />
    </div>
  )
}
