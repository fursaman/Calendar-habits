import { Flame } from 'lucide-react'
import { type CSSProperties, useMemo, useState } from 'react'

import { StreakCard, streakHaloClassName } from '@/components/habits/StreakCard'
import { useToday } from '@/hooks'
import { fromDateKey } from '@/lib/calendar'
import { getStreak, habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppState } from '@/state'

/**
 * Current streaks, in the same dark card as the streak popup. Opens on the
 * habit with the longest streak; the chips switch between habits.
 */
export function AnalyticsStreak() {
  const { habits, completions } = useAppState()
  const today = useToday()
  const streaks = useMemo(
    () => habits.map((habit) => ({ habit, days: getStreak(completions, habit.id, today) })),
    [habits, completions, today],
  )
  const longest = streaks.reduce<(typeof streaks)[number] | undefined>(
    (best, item) => (!best || item.days > best.days ? item : best),
    undefined,
  )
  const [selectedId, setSelectedId] = useState(longest?.habit.id)
  const selected = streaks.find((item) => item.habit.id === selectedId) ?? longest
  if (!selected) return null

  return (
    <section aria-label="Current streaks" className={streakHaloClassName}>
      <StreakCard
        habit={selected.habit}
        days={selected.days}
        date={fromDateKey(today)}
        footer={
          streaks.length > 1 && (
            <div className="-mx-1 mt-4 scrollbar-none flex gap-1.5 overflow-x-auto px-1">
              {streaks.map(({ habit, days }) => {
                const active = habit.id === selected.habit.id
                return (
                  <button
                    key={habit.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedId(habit.id)}
                    style={{ '--habit': habitColorVar(habit.color) } as CSSProperties}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-pill py-1 pr-2.5 pl-1.5 text-label transition-colors duration-fast',
                      active
                        ? 'bg-island-foreground text-island'
                        : 'bg-island-raised text-island-foreground hover:bg-island-raised/70',
                    )}
                  >
                    <span aria-hidden="true" className="size-2.5 rounded-pill bg-(--habit)" />
                    <span className="max-w-28 truncate">{habit.name}</span>
                    <span className="flex items-center gap-0.5 tabular-nums">
                      <Flame
                        aria-hidden="true"
                        className="size-3"
                        fill="url(#streak-gradient)"
                        stroke="url(#streak-gradient)"
                      />
                      {days}
                      <span className="sr-only"> day streak</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )
        }
      />
    </section>
  )
}
