import { type CSSProperties, type SyntheticEvent, useRef, useState } from 'react'

import {
  formatDayOfMonth,
  formatFullDate,
  formatMonthNarrow,
  formatMonthYear,
  formatWeekday,
} from '@/lib/calendar'
import { type ActivityBucket, type AnalyticsPeriod, habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

/** Day-of-month labels on the month axis; the rest stay in the tooltip. */
const MONTH_TICKS = new Set([1, 8, 15, 22, 29])

function niceMax(value: number): number {
  if (value <= 5) return Math.max(1, value)
  const step = 10 ** Math.floor(Math.log10(value))
  return Math.ceil(value / step) * step
}

function bucketLabel(bucket: ActivityBucket, period: AnalyticsPeriod) {
  if (period === 'year') return formatMonthYear(bucket.start)
  return formatFullDate(bucket.start)
}

function axisLabel(bucket: ActivityBucket, period: AnalyticsPeriod): string | null {
  if (period === 'week') return formatWeekday(bucket.start, 'short')
  if (period === 'year') return formatMonthNarrow(bucket.start)
  const day = bucket.start.getDate()
  return MONTH_TICKS.has(day) ? formatDayOfMonth(bucket.start) : null
}

export type ActivityChartProps = {
  buckets: ActivityBucket[]
  habits: readonly Habit[]
  period: AnalyticsPeriod
}

/**
 * Stacked columns: completed habits per day (or per month in a year), one
 * segment per habit in fixed habit order. Hover, tap, or focus a column for
 * its breakdown.
 */
export function ActivityChart({ buckets, habits, period }: ActivityChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  /** Hovered/tapped column and its center, in px from the chart's left edge. */
  const [hover, setHover] = useState<{ index: number; x: number } | null>(null)
  const active = hover?.index ?? null

  function activate(index: number, event: SyntheticEvent<HTMLElement>) {
    const chart = chartRef.current?.getBoundingClientRect()
    const column = event.currentTarget.getBoundingClientRect()
    if (!chart) return
    setHover({ index, x: column.left + column.width / 2 - chart.left })
  }
  const clear = () => setHover(null)
  const max =
    period === 'year'
      ? niceMax(Math.max(...buckets.map((bucket) => bucket.total), habits.length))
      : Math.max(1, habits.length)
  const ticks = [max, Math.round(max / 2), 0].filter((tick, i, all) => all.indexOf(tick) === i)
  const activeBucket = active === null ? null : buckets[active]

  return (
    <div ref={chartRef} className="relative">
      <div className="flex gap-2">
        {/* Y axis */}
        <div className="relative w-6 shrink-0 text-right text-caption text-muted-foreground tabular-nums">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(1 - tick / max) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="relative h-40 flex-1">
          {/* Hairline gridlines */}
          {ticks.map((tick) => (
            <span
              key={tick}
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 h-px',
                tick === 0 ? 'bg-border' : 'bg-border-subtle',
              )}
              style={{ top: `${(1 - tick / max) * 100}%` }}
            />
          ))}

          <div className="absolute inset-0 flex items-end">
            {buckets.map((bucket, index) => (
              <button
                key={bucket.days[0]}
                type="button"
                aria-label={`${bucketLabel(bucket, period)}: ${bucket.total} completed`}
                onPointerEnter={(event) => activate(index, event)}
                onPointerLeave={clear}
                onFocus={(event) => activate(index, event)}
                onBlur={clear}
                onClick={(event) => activate(index, event)}
                className="group flex h-full min-w-0 flex-1 items-end justify-center px-px outline-offset-[-2px]"
              >
                <span
                  className={cn(
                    'flex w-full max-w-6 origin-bottom animate-bar-grow flex-col-reverse gap-0.5 transition-opacity duration-fast',
                    active !== null && active !== index && 'opacity-40',
                  )}
                  style={{ animationDelay: `${index * 12}ms` } as CSSProperties}
                >
                  {habits.map((habit) => {
                    const count = bucket.counts[habit.id] ?? 0
                    if (count === 0) return null
                    return (
                      <span
                        key={habit.id}
                        className="block w-full first:rounded-b-none last:rounded-t-sm"
                        style={{
                          height: `calc(${(count / max) * 10}rem - 2px)`,
                          backgroundColor: habitColorVar(habit.color),
                        }}
                      />
                    )
                  })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* X axis */}
      <div className="mt-1.5 ml-8 flex">
        {buckets.map((bucket) => (
          <span
            key={bucket.days[0]}
            aria-hidden="true"
            className="min-w-0 flex-1 text-center text-date-sm text-muted-foreground"
          >
            {axisLabel(bucket, period)}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      {/* Above the column, centered on it but clamped so it never leaves the chart. */}
      {activeBucket && hover && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 w-44 -translate-y-full animate-fade-in rounded-md bg-surface p-2.5 shadow-elevated dark:bg-surface-tertiary"
          style={{
            left: `clamp(0px, ${hover.x}px - 5.5rem, 100% - 11rem)`,
            // Just above the top of the hovered column (the plot is 10rem tall).
            top: `calc(${1 - Math.min(activeBucket.total / max, 1)} * 10rem - 0.5rem)`,
          }}
        >
          <p className="mb-1.5 text-label text-foreground">{bucketLabel(activeBucket, period)}</p>
          <ul className="space-y-1">
            {habits.map((habit) => (
              <li key={habit.id} className="flex items-center gap-2 text-caption">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-pill"
                  style={{ backgroundColor: habitColorVar(habit.color) }}
                />
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{habit.name}</span>
                <span className="font-medium text-foreground tabular-nums">
                  {period === 'year'
                    ? (activeBucket.counts[habit.id] ?? 0)
                    : activeBucket.counts[habit.id]
                      ? 'Done'
                      : '–'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
