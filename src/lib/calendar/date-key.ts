import { format, isValid, parse } from 'date-fns'

import type { DateKey } from '@/types'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * Date keys are always derived from *local* calendar fields. Never use
 * `toISOString()` for this: it converts to UTC and shifts the day for
 * users east or west of Greenwich near midnight.
 */
export function toDateKey(date: Date): DateKey {
  return format(date, DATE_KEY_FORMAT) as DateKey
}

/** Parses a key into a Date at local midnight. */
export function fromDateKey(key: DateKey): Date {
  return parse(key, DATE_KEY_FORMAT, new Date())
}

export function isDateKey(value: unknown): value is DateKey {
  if (typeof value !== 'string' || !DATE_KEY_PATTERN.test(value)) return false
  const parsed = parse(value, DATE_KEY_FORMAT, new Date())
  // Round-trip rejects impossible dates such as 2025-02-30.
  return isValid(parsed) && format(parsed, DATE_KEY_FORMAT) === value
}

export function todayKey(now: Date = new Date()): DateKey {
  return toDateKey(now)
}
