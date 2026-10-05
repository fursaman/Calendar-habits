import { addMonths, addWeeks, addYears } from 'date-fns'
import { useMemo, useState } from 'react'

import { DateNavigator } from '@/components/navigation/DateNavigator'
import { Dialog, DialogContent, SegmentedControl, type SegmentedOption } from '@/components/ui'
import { useToday } from '@/hooks'
import { formatPeriod, fromDateKey } from '@/lib/calendar'
import {
  type AnalyticsPeriod,
  getActivityBuckets,
  getHabitBalance,
  habitColorVar,
} from '@/lib/habits'
import { useAppActions, useAppState } from '@/state'

import { ActivityChart } from './ActivityChart'
import { AnalyticsStreak } from './AnalyticsStreak'
import { HabitRings } from './HabitRings'

const PERIOD_OPTIONS: readonly SegmentedOption<AnalyticsPeriod>[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const SHIFT = { week: addWeeks, month: addMonths, year: addYears } as const

export function AnalyticsDialog() {
  const { analyticsOpen } = useAppState()
  const { setAnalyticsOpen } = useAppActions()
  return (
    <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
      {analyticsOpen && <AnalyticsContent />}
    </Dialog>
  )
}

/** Mounted per opening, so it starts on the calendar's current period. */
function AnalyticsContent() {
  const { habits, completions, activeDate, view, settings } = useAppState()
  const today = useToday()
  const { weekStartsOn } = settings.calendar
  const [period, setPeriod] = useState<AnalyticsPeriod>(view === 'day' ? 'week' : view)
  const [anchor, setAnchor] = useState(() => fromDateKey(activeDate))

  const buckets = useMemo(
    () => getActivityBuckets(completions, habits, anchor, period, weekStartsOn),
    [completions, habits, anchor, period, weekStartsOn],
  )
  const balance = useMemo(
    () => getHabitBalance(completions, habits, anchor, period, weekStartsOn, today),
    [completions, habits, anchor, period, weekStartsOn, today],
  )

  const completed = balance.reduce((sum, item) => sum + item.completed, 0)
  const possible = balance.reduce((sum, item) => sum + item.possible, 0)
  const perfectDays = buckets
    .flatMap((bucket) => bucket.days)
    .filter(
      (key) => habits.length > 0 && habits.every((habit) => completions[key]?.[habit.id]),
    ).length

  const stats = [
    { label: 'Completed', value: String(completed) },
    {
      label: 'Consistency',
      value: possible ? `${Math.round((completed / possible) * 100)}%` : '–',
    },
    { label: 'Perfect days', value: String(perfectDays) },
  ]

  return (
    <DialogContent title="Analytics" className="sm:max-w-2xl">
      <div className="space-y-7 pt-1">
        {habits.length > 0 && <AnalyticsStreak />}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedControl
            label="Period"
            value={period}
            onValueChange={setPeriod}
            options={PERIOD_OPTIONS}
            className="sm:w-64"
          />
          <DateNavigator
            className="sm:min-w-64"
            label={
              <span className="text-nav tabular-nums">
                {formatPeriod(anchor, period, weekStartsOn)}
              </span>
            }
            previousLabel={`Previous ${period}`}
            nextLabel={`Next ${period}`}
            onPrevious={() => setAnchor((current) => SHIFT[period](current, -1))}
            onNext={() => setAnchor((current) => SHIFT[period](current, 1))}
          />
        </div>

        <dl className="grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-surface-secondary p-3 dark:bg-surface-tertiary/50"
            >
              <dt className="text-caption text-muted-foreground">{stat.label}</dt>
              <dd className="text-heading tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>

        {habits.length === 0 ? (
          <p className="text-body text-muted-foreground">Add a habit to see your analytics.</p>
        ) : (
          <>
            <section aria-labelledby="activity-title" className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 id="activity-title" className="text-title">
                  Activity
                </h3>
                <p className="text-caption text-muted-foreground">
                  {period === 'year' ? 'Completions per month' : 'Habits completed per day'}
                </p>
              </div>
              <ActivityChart buckets={buckets} habits={habits} period={period} />
            </section>

            <section aria-labelledby="balance-title" className="space-y-3">
              <h3 id="balance-title" className="text-title">
                Habit balance
              </h3>
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <HabitRings balance={balance} />
                {/* Legend doubles as the data table for the rings. */}
                <table className="w-full text-body">
                  <caption className="sr-only">Completion by habit for this period</caption>
                  <tbody>
                    {balance.map((item) => (
                      <tr
                        key={item.habit.id}
                        className="border-b border-border-subtle last:border-b-0"
                      >
                        <th scope="row" className="py-2 text-left font-normal">
                          <span className="flex items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className="size-2.5 shrink-0 rounded-pill"
                              style={{ backgroundColor: habitColorVar(item.habit.color) }}
                            />
                            {item.habit.name}
                          </span>
                        </th>
                        <td className="py-2 text-right text-muted-foreground tabular-nums">
                          {item.completed}/{item.possible}
                        </td>
                        <td className="w-14 py-2 text-right font-semibold tabular-nums">
                          {Math.round(item.ratio * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </DialogContent>
  )
}
