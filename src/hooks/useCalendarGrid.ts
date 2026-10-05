import { useMemo } from 'react'

import {
  chunkIntoWeeks,
  getMonthGridDays,
  getWeekdayReferenceDates,
  getWeekDays,
  getYearMonths,
} from '@/lib/calendar'
import type { Weekday } from '@/types'

export function useMonthGrid(date: Date, weekStartsOn: Weekday): Date[][] {
  return useMemo(() => chunkIntoWeeks(getMonthGridDays(date, weekStartsOn)), [date, weekStartsOn])
}

export function useWeekDays(date: Date, weekStartsOn: Weekday): Date[] {
  return useMemo(() => getWeekDays(date, weekStartsOn), [date, weekStartsOn])
}

export function useYearMonths(date: Date): Date[] {
  return useMemo(() => getYearMonths(date), [date])
}

export function useWeekdayHeaders(weekStartsOn: Weekday): Date[] {
  return useMemo(() => getWeekdayReferenceDates(weekStartsOn), [weekStartsOn])
}
