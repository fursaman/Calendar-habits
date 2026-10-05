import { eachDayOfInterval, eachMonthOfInterval, endOfMonth, startOfMonth } from 'date-fns'

import { getMonthRange, getWeekRange, getYearRange, toDateKey } from '@/lib/calendar'
import type { CompletionMap, DateKey, Habit, Weekday } from '@/types'

import { isCompleted } from './completions'

export const ANALYTICS_PERIODS = ['week', 'month', 'year'] as const
export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number]

/** One column of the activity chart: a day (week/month) or a month (year). */
export type ActivityBucket = {
  start: Date
  days: DateKey[]
  /** Completions per habit id within the bucket. */
  counts: Record<string, number>
  total: number
}

export type HabitBalance = {
  habit: Habit
  completed: number
  /** Days that could have been completed: in the period and not in the future. */
  possible: number
  ratio: number
}

export function getPeriodRange(anchor: Date, period: AnalyticsPeriod, weekStartsOn: Weekday) {
  if (period === 'week') return getWeekRange(anchor, weekStartsOn)
  if (period === 'month') return getMonthRange(anchor)
  return getYearRange(anchor)
}

export function getActivityBuckets(
  map: CompletionMap,
  habits: readonly Habit[],
  anchor: Date,
  period: AnalyticsPeriod,
  weekStartsOn: Weekday,
): ActivityBucket[] {
  const range = getPeriodRange(anchor, period, weekStartsOn)
  const groups =
    period === 'year'
      ? eachMonthOfInterval(range).map((month) => ({
          start: month,
          days: eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }),
        }))
      : eachDayOfInterval(range).map((day) => ({ start: day, days: [day] }))

  return groups.map(({ start, days }) => {
    const keys = days.map(toDateKey)
    const counts: Record<string, number> = {}
    let total = 0
    for (const habit of habits) {
      const count = keys.filter((key) => isCompleted(map, key, habit.id)).length
      counts[habit.id] = count
      total += count
    }
    return { start, days: keys, counts, total }
  })
}

export function getHabitBalance(
  map: CompletionMap,
  habits: readonly Habit[],
  anchor: Date,
  period: AnalyticsPeriod,
  weekStartsOn: Weekday,
  today: DateKey,
): HabitBalance[] {
  const keys = eachDayOfInterval(getPeriodRange(anchor, period, weekStartsOn))
    .map(toDateKey)
    .filter((key) => key <= today)
  return habits.map((habit) => {
    const completed = keys.filter((key) => isCompleted(map, key, habit.id)).length
    return {
      habit,
      completed,
      possible: keys.length,
      ratio: keys.length ? completed / keys.length : 0,
    }
  })
}
