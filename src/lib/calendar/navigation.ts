import { addMonths, addWeeks, addYears } from 'date-fns'

import type { CalendarView } from '@/types'

export type NavigationDirection = -1 | 1

/** Moves the anchor date by one unit of the given view. */
export function shiftDate(date: Date, view: CalendarView, direction: NavigationDirection): Date {
  switch (view) {
    case 'week':
      return addWeeks(date, direction)
    case 'month':
      return addMonths(date, direction)
    case 'year':
      return addYears(date, direction)
  }
}
