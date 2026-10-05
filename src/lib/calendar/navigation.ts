import { addDays, addMonths, addWeeks, addYears, format, getWeek, getWeekYear } from 'date-fns'

import type { CalendarView, Weekday } from '@/types'

export type NavigationDirection = -1 | 1

/** Moves the anchor date by one unit of the given view. */
export function shiftDate(date: Date, view: CalendarView, direction: NavigationDirection): Date {
  switch (view) {
    case 'day':
      return addDays(date, direction)
    case 'week':
      return addWeeks(date, direction)
    case 'month':
      return addMonths(date, direction)
    case 'year':
      return addYears(date, direction)
  }
}

/**
 * Identifies the period a view is showing. When it changes, the calendar
 * animates; selecting another day inside the same period doesn't.
 */
export function getPeriodKey(date: Date, view: CalendarView, weekStartsOn: Weekday): string {
  switch (view) {
    case 'day':
      return format(date, 'yyyy-MM-dd')
    case 'week':
      return `${getWeekYear(date, { weekStartsOn })}-w${getWeek(date, { weekStartsOn })}`
    case 'month':
      return format(date, 'yyyy-MM')
    case 'year':
      return format(date, 'yyyy')
  }
}
