import { Flame } from 'lucide-react'

import { formatMonth, fromDateKey } from '@/lib/calendar'
import { getMonthCount, getStreak } from '@/lib/habits'
import { useAppState } from '@/state'
import type { DateKey } from '@/types'

import { HabitGlyph } from './HabitGlyph'

/** Per-habit streak and monthly count, relative to the given day. */
export function HabitStats({ date }: { date: DateKey }) {
  const { habits, completions } = useAppState()
  if (habits.length === 0) return null
  const month = formatMonth(fromDateKey(date))

  return (
    <section aria-labelledby="habit-stats-title" className="px-4 pb-5">
      <h3 id="habit-stats-title" className="px-1 pb-2 text-label text-muted-foreground">
        Consistency
      </h3>
      <ul className="grid grid-cols-2 gap-2">
        {habits.map((habit) => {
          const streak = getStreak(completions, habit.id, date)
          const monthCount = getMonthCount(completions, habit.id, date)
          return (
            <li
              key={habit.id}
              className="flex items-center gap-2.5 rounded-lg bg-surface-tertiary/60 p-2.5"
            >
              <HabitGlyph habit={habit} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-label text-foreground">{habit.name}</p>
                <p className="flex items-center gap-1 text-caption text-muted-foreground tabular-nums">
                  {streak > 1 && (
                    <>
                      <Flame className="size-3 text-warning" aria-hidden="true" />
                      <span>
                        {streak}
                        <span className="sr-only"> day streak</span>
                      </span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span>
                    {monthCount} in {month}
                  </span>
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
