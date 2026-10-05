import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns'
import { Check } from 'lucide-react'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

import { useWeekDays } from '@/hooks'
import { formatMonth, formatWeekday, fromDateKey, toDateKey } from '@/lib/calendar'
import { habitColorVar, isCompleted } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { type StreakCelebration, useAppActions, useAppState } from '@/state'
import type { CompletionMap, Habit, Weekday } from '@/types'

import { FireAnimation } from './FireAnimation'

const VISIBLE_MS = 3000

/**
 * Celebrates extending a streak today. Drops in from the top like a Dynamic
 * Island panel, and closes after three seconds, on a tap outside, or Escape.
 */
export function StreakPopup() {
  const { celebration, habits } = useAppState()
  const habit = habits.find((item) => item.id === celebration?.habitId)
  // Re-key on each celebration so the entrance animation replays.
  return celebration && habit ? (
    <StreakPopupCard
      key={`${celebration.habitId}:${celebration.days}`}
      celebration={celebration}
      habit={habit}
    />
  ) : null
}

function StreakPopupCard({ celebration, habit }: { celebration: StreakCelebration; habit: Habit }) {
  const { completions, settings } = useAppState()
  const { dismissCelebration } = useAppActions()
  const cardRef = useRef<HTMLDivElement>(null)
  const [leaving, setLeaving] = useState(false)

  // Auto-close, and close on a tap outside or Escape.
  useEffect(() => {
    const close = () => setLeaving(true)
    const timer = window.setTimeout(close, VISIBLE_MS)
    const onPointerDown = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const date = fromDateKey(celebration.date)
  const color = habitColorVar(habit.color)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-(--z-tooltip) flex justify-center px-3 pt-[max(--spacing(2),env(safe-area-inset-top))]">
      {/* A 4px halo of the panel color at 12% sits outside the panel. */}
      <div
        ref={cardRef}
        onAnimationEnd={(event) =>
          leaving && event.target === event.currentTarget && dismissCelebration()
        }
        className={cn(
          'pointer-events-auto w-full max-w-sm origin-top rounded-[calc(1.75rem+4px)] bg-island/12 p-1',
          leaving ? 'animate-island-out' : 'animate-island-in',
        )}
      >
        <div
          role="status"
          aria-live="polite"
          style={{ '--habit': color } as CSSProperties}
          className="rounded-[1.75rem] bg-island p-4 text-island-foreground shadow-modal"
        >
          <div className="flex items-center gap-3">
            <FireAnimation className="h-14 w-10" />
            <div className="min-w-0 flex-1">
              <p className="text-weekday tracking-widest text-island-muted uppercase">Streak</p>
              <p className="text-heading tabular-nums">
                {celebration.days} {celebration.days === 1 ? 'day' : 'days'}
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-pill bg-island-raised py-1 pr-3 pl-1.5 text-label">
              <span aria-hidden="true" className="size-2.5 rounded-pill bg-(--habit)" />
              {habit.name}
            </span>
          </div>

          <WeekRow
            completions={completions}
            habit={habit}
            date={date}
            weekStartsOn={settings.calendar.weekStartsOn}
          />
          <MonthTimeline completions={completions} habit={habit} date={date} />
        </div>
      </div>
    </div>
  )
}

/** This week: done days filled with a check, today ringed, upcoming days dim. */
function WeekRow({
  completions,
  habit,
  date,
  weekStartsOn,
}: {
  completions: CompletionMap
  habit: Habit
  date: Date
  weekStartsOn: Weekday
}) {
  const days = useWeekDays(date, weekStartsOn)
  const today = toDateKey(date)

  return (
    <ol className="mt-4 grid grid-cols-7 gap-1" aria-label="This week">
      {days.map((day, index) => {
        const key = toDateKey(day)
        const done = isCompleted(completions, key, habit.id)
        const isToday = key === today
        const upcoming = key > today
        return (
          <li key={key} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-pill',
                done && 'animate-check-pop bg-(--habit) text-on-habit',
                !done && upcoming && 'bg-island-raised/60',
                !done && !upcoming && 'bg-island-raised',
                isToday && 'ring-2 ring-island-foreground/80 ring-offset-2 ring-offset-island',
              )}
              style={done ? { animationDelay: `${index * 50}ms` } : undefined}
            >
              {done && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
              <span className="sr-only">
                {formatWeekday(day, 'long')}: {done ? 'done' : upcoming ? 'upcoming' : 'missed'}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'text-date-sm',
                isToday ? 'text-island-foreground' : 'text-island-muted',
              )}
            >
              {formatWeekday(day, 'narrow')}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** The whole month as a thin timeline: one segment per day, done days in the habit color. */
function MonthTimeline({
  completions,
  habit,
  date,
}: {
  completions: CompletionMap
  habit: Habit
  date: Date
}) {
  const days = eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) })
  const today = toDateKey(date)
  const done = days.filter((day) => isCompleted(completions, toDateKey(day), habit.id)).length

  return (
    <div className="mt-4">
      <div className="mb-1.5 flex justify-between text-caption text-island-muted">
        <span>{formatMonth(date)}</span>
        <span className="tabular-nums">
          {done} / {days.length} days
        </span>
      </div>
      <div className="flex h-2 gap-0.5" aria-hidden="true">
        {days.map((day, index) => {
          const key = toDateKey(day)
          const complete = isCompleted(completions, key, habit.id)
          return (
            <span
              key={key}
              className={cn(
                'flex-1 rounded-pill',
                complete ? 'origin-bottom animate-bar-grow bg-(--habit)' : 'bg-island-raised',
                key > today && 'opacity-50',
                key === today && 'ring-1 ring-island-foreground',
              )}
              style={complete ? { animationDelay: `${150 + index * 15}ms` } : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
