import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns'

import type { Weekday } from '@/types'

const DAYS_PER_WEEK = 7

export type DateRange = { start: Date; end: Date }

export function getWeekRange(date: Date, weekStartsOn: Weekday): DateRange {
  return { start: startOfWeek(date, { weekStartsOn }), end: endOfWeek(date, { weekStartsOn }) }
}

export function getMonthRange(date: Date): DateRange {
  return { start: startOfMonth(date), end: endOfMonth(date) }
}

export function getYearRange(date: Date): DateRange {
  return { start: startOfYear(date), end: endOfYear(date) }
}

export function getWeekDays(date: Date, weekStartsOn: Weekday): Date[] {
  return eachDayOfInterval(getWeekRange(date, weekStartsOn))
}

/**
 * Days for a month grid, padded with leading/trailing days from adjacent
 * months so the grid is made of full weeks.
 */
export function getMonthGridDays(date: Date, weekStartsOn: Weekday): Date[] {
  const { start, end } = getMonthRange(date)
  return eachDayOfInterval({
    start: startOfWeek(start, { weekStartsOn }),
    end: endOfWeek(end, { weekStartsOn }),
  })
}

/** Splits a flat list of days into rows of seven. */
export function chunkIntoWeeks(days: Date[]): Date[][] {
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    weeks.push(days.slice(i, i + DAYS_PER_WEEK))
  }
  return weeks
}

export function getYearMonths(date: Date): Date[] {
  return eachMonthOfInterval(getYearRange(date))
}

/** Ordered weekday indices starting at `weekStartsOn`, for grid headers. */
export function getWeekdayOrder(weekStartsOn: Weekday): Weekday[] {
  return Array.from(
    { length: DAYS_PER_WEEK },
    (_, i) => ((weekStartsOn + i) % DAYS_PER_WEEK) as Weekday,
  )
}

/** A reference date for each weekday index, used only to format weekday names. */
export function getWeekdayReferenceDates(weekStartsOn: Weekday): Date[] {
  const start = startOfWeek(new Date(), { weekStartsOn })
  return Array.from({ length: DAYS_PER_WEEK }, (_, i) => addDays(start, i))
}

const GRID_WEEKS = 6

/** Month grid always padded to six weeks, so mini months line up in the year view. */
export function getFixedMonthGridDays(date: Date, weekStartsOn: Weekday): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn })
  return Array.from({ length: GRID_WEEKS * DAYS_PER_WEEK }, (_, i) => addDays(start, i))
}
