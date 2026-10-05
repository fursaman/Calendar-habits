import { useToday, useToggleHabit } from '@/hooks'
import { getDay, getStreak } from '@/lib/habits'
import { useAppState } from '@/state'
import type { DateKey } from '@/types'

import { AddHabitButton } from './AddHabitButton'
import { HabitRow } from './HabitRow'

export type HabitChecklistProps = {
  date: DateKey
  size?: 'md' | 'lg'
  showStreaks?: boolean
}

/** Every habit for one day with its completion checkbox. Changes apply instantly. */
export function HabitChecklist({ date, size = 'md', showStreaks = false }: HabitChecklistProps) {
  const { habits, completions } = useAppState()
  const toggleHabit = useToggleHabit()
  const today = useToday()
  const isFuture = date > today
  const day = getDay(completions, date)

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
        <p className="text-body text-muted-foreground">No habits yet. Add one to start tracking.</p>
        <AddHabitButton size={size} />
      </div>
    )
  }

  return (
    <div>
      <ul className="space-y-0.5" aria-label="Habits">
        {habits.map((habit) => {
          const streak = showStreaks ? getStreak(completions, habit.id, date) : 0
          return (
            <li key={habit.id}>
              <HabitRow
                habit={habit}
                size={size}
                checked={day[habit.id] === true}
                disabled={isFuture}
                onCheckedChange={() => toggleHabit(date, habit.id)}
                meta={streak > 1 ? `${streak}-day streak` : undefined}
              />
            </li>
          )
        })}
        <li>
          <AddHabitButton size={size} />
        </li>
      </ul>
      {isFuture && (
        <p className="px-3 pt-2 text-caption text-muted-foreground">
          You can mark habits for this day once it arrives.
        </p>
      )}
    </div>
  )
}
