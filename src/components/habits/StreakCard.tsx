import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns'
import { Check } from 'lucide-react'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'

import { useWeekDays } from '@/hooks'
import { formatMonth, formatWeekday, toDateKey } from '@/lib/calendar'
import { habitColorVar, isCompleted } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppState } from '@/state'
import type { CompletionMap, Habit, Weekday } from '@/types'

import { FireAnimation } from './FireAnimation'

export type StreakCardProps = Omit<ComponentProps<'div'>, 'children'> & {
  habit: Habit
  days: number
  /** The day the streak is measured to (usually today). */
  date: Date
  /** Extra content under the month timeline, e.g. habit switcher chips. */
  footer?: ReactNode
}

/**
 * The dark streak card: animated fire, streak length, this week, and the
 * month as a timeline. Used by the streak popup and the Analytics page.
 */
export function StreakCard({
  habit,
  days,
  date,
  footer,
  className,
  style,
  ...props
}: StreakCardProps) {
  const { completions, settings } = useAppState()
  return (
    <div
      style={{ '--habit': habitColorVar(habit.color), ...style } as CSSProperties}
      className={cn('rounded-[1.75rem] bg-island p-4 text-island-foreground', className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <FireAnimation className="h-14 w-10" />
        <div className="min-w-0 flex-1">
          <p className="text-weekday tracking-widest text-island-muted uppercase">Streak</p>
          <p className="text-heading tabular-nums">
            {days} {days === 1 ? 'day' : 'days'}
          </p>
        </div>
        <span className="flex min-w-0 items-center gap-1.5 rounded-pill bg-island-raised py-1 pr-3 pl-1.5 text-label">
          <span aria-hidden="true" className="size-2.5 shrink-0 rounded-pill bg-(--habit)" />
          <span className="truncate">{habit.name}</span>
        </span>
      </div>

      <WeekRow
        completions={completions}
        habit={habit}
        date={date}
        weekStartsOn={settings.calendar.weekStartsOn}
      />
      <MonthTimeline completions={completions} habit={habit} date={date} />
      {footer}
    </div>
  )
}

/** The 4px halo of the panel color at 12% that sits outside the card. */
export const streakHaloClassName = 'rounded-[calc(1.75rem+4px)] bg-island/12 p-1'

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
