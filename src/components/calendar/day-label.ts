import { formatFullDate } from '@/lib/calendar'
import type { Habit } from '@/types'

/** Accessible description of a day, so completion is never conveyed by color alone. */
export function describeDay(
  date: Date,
  completed: readonly Habit[],
  total: number,
  isToday: boolean,
): string {
  const parts = [formatFullDate(date)]
  if (isToday) parts.push('today')
  if (total > 0) {
    const names = completed.map((habit) => habit.name).join(', ')
    parts.push(
      completed.length === 0
        ? 'no habits completed'
        : total === 1
          ? 'completed'
          : `${completed.length} of ${total} completed: ${names}`,
    )
  }
  return parts.join(', ')
}
