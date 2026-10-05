import { addDays, eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns'

import { fromDateKey, toDateKey } from '@/lib/calendar'
import type { CompletionMap, DateKey, HabitId } from '@/types'

import { isCompleted } from './completions'

/**
 * Consecutive completed days ending on `date`. If `date` itself isn't done
 * yet, the streak through the previous day still counts, so a streak doesn't
 * look broken in the morning before the habit is marked.
 */
export function getStreak(map: CompletionMap, habitId: HabitId, date: DateKey): number {
  let cursor = fromDateKey(date)
  if (!isCompleted(map, date, habitId)) cursor = addDays(cursor, -1)

  let streak = 0
  while (isCompleted(map, toDateKey(cursor), habitId)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

/** Completed days in the month containing `date`, up to and including `date`'s month end. */
export function getMonthCount(map: CompletionMap, habitId: HabitId, date: DateKey): number {
  const anchor = fromDateKey(date)
  return eachDayOfInterval({ start: startOfMonth(anchor), end: endOfMonth(anchor) }).filter((day) =>
    isCompleted(map, toDateKey(day), habitId),
  ).length
}

export type StreakLink = {
  /** The previous day is also completed: draw the streak line in from the left. */
  joinsPrevious: boolean
  /** The next day is also completed: draw the streak line out to the right. */
  joinsNext: boolean
  /** Set on the last day of a streak of two or more days. */
  length?: number
}

/** Streak links for each completed day among `dates`, for drawing streak lines. */
export function getStreakLinks(
  map: CompletionMap,
  habitId: HabitId,
  dates: readonly DateKey[],
): Map<DateKey, StreakLink> {
  const links = new Map<DateKey, StreakLink>()
  for (const key of dates) {
    if (!isCompleted(map, key, habitId)) continue
    const day = fromDateKey(key)
    const joinsPrevious = isCompleted(map, toDateKey(addDays(day, -1)), habitId)
    const joinsNext = isCompleted(map, toDateKey(addDays(day, 1)), habitId)
    const length = joinsPrevious && !joinsNext ? getStreak(map, habitId, key) : undefined
    links.set(key, { joinsPrevious, joinsNext, ...(length ? { length } : {}) })
  }
  return links
}
