import { differenceInCalendarDays, getISOWeek, getWeek } from 'date-fns'

import type { CalendarView, Weekday } from '@/types'

import { getWeekRange } from './ranges'

/**
 * Locale-aware display formatting. Uses Intl so labels follow the user's
 * language without bundling date-fns locales.
 */

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(options: Intl.DateTimeFormatOptions, locale?: string) {
  const cacheKey = `${locale ?? ''}|${JSON.stringify(options)}`
  let formatter = formatterCache.get(cacheKey)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options)
    formatterCache.set(cacheKey, formatter)
  }
  return formatter
}

/** "October 2026" */
export function formatMonthYear(date: Date, locale?: string): string {
  return getFormatter({ month: 'long', year: 'numeric' }, locale).format(date)
}

/** "October" */
export function formatMonth(date: Date, locale?: string): string {
  return getFormatter({ month: 'long' }, locale).format(date)
}

/** "2026" */
export function formatYear(date: Date, locale?: string): string {
  return getFormatter({ year: 'numeric' }, locale).format(date)
}

/** "Mon" or "M" */
export function formatWeekday(
  date: Date,
  width: 'long' | 'short' | 'narrow' = 'short',
  locale?: string,
): string {
  return getFormatter({ weekday: width }, locale).format(date)
}

/** "Monday, October 5, 2026" — suitable for accessible labels. */
export function formatFullDate(date: Date, locale?: string): string {
  return getFormatter({ dateStyle: 'full' }, locale).format(date)
}

/** "Mon, Oct 5" */
export function formatShortDate(date: Date, locale?: string): string {
  return getFormatter({ weekday: 'short', month: 'short', day: 'numeric' }, locale).format(date)
}

/** "October 5" */
export function formatMonthDay(date: Date, locale?: string): string {
  return getFormatter({ month: 'long', day: 'numeric' }, locale).format(date)
}

/** "5" */
export function formatDayOfMonth(date: Date, locale?: string): string {
  return getFormatter({ day: 'numeric' }, locale).format(date)
}

/** "Today", "Yesterday", "Tomorrow", or `fallback(date)`. */
export function formatRelativeDay(
  date: Date,
  today: Date,
  fallback: (date: Date) => string = formatShortDate,
): string {
  const diff = differenceInCalendarDays(date, today)
  if (diff === 0) return 'Today'
  if (diff === -1) return 'Yesterday'
  if (diff === 1) return 'Tomorrow'
  return fallback(date)
}

/** Title for the current period of a view, e.g. "Sep 28 – Oct 4, 2026" for a week. */
export function formatPeriod(
  date: Date,
  view: CalendarView,
  weekStartsOn: Weekday,
  locale?: string,
  /** Shorter month names, for narrow screens. */
  compact = false,
): string {
  const month = compact ? 'short' : 'long'
  switch (view) {
    case 'year':
      return formatYear(date, locale)
    case 'month':
      return getFormatter({ month, year: 'numeric' }, locale).format(date)
    case 'week': {
      const { start, end } = getWeekRange(date, weekStartsOn)
      // Skip the year for weeks in the current year to keep the title short.
      const thisYear = new Date().getFullYear()
      const showYear = start.getFullYear() !== thisYear || end.getFullYear() !== thisYear
      return getFormatter(
        { month: 'short', day: 'numeric', ...(showYear ? { year: 'numeric' } : {}) },
        locale,
      ).formatRange(start, end)
    }
    case 'day':
      return getFormatter(
        { month, day: 'numeric', ...(compact ? {} : { year: 'numeric' }) },
        locale,
      ).format(date)
  }
}

/**
 * Week number: ISO 8601 (weeks start Monday, week 1 holds the first Thursday)
 * when weeks start on Monday; otherwise the US convention (week 1 holds Jan 1).
 */
export function getWeekNumber(date: Date, weekStartsOn: Weekday): number {
  return weekStartsOn === 1
    ? getISOWeek(date)
    : getWeek(date, { weekStartsOn, firstWeekContainsDate: 1 })
}

/** "28 Sep – 4 Oct" (no year), for compact week subtitles. */
export function formatWeekRange(date: Date, weekStartsOn: Weekday, locale?: string): string {
  const { start, end } = getWeekRange(date, weekStartsOn)
  return getFormatter({ month: 'short', day: 'numeric' }, locale).formatRange(start, end)
}
