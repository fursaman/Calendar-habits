import type { CompletionMap, DateKey, HabitCompletion, HabitId } from '@/types'

export function isCompleted(map: CompletionMap, date: DateKey, habitId: HabitId): boolean {
  return map[date]?.[habitId] === true
}

/** Returns a new map with the completion set; never mutates the input. */
export function setCompletion(
  map: CompletionMap,
  { habitId, date, completed }: HabitCompletion,
): CompletionMap {
  const day = { ...map[date] }
  if (completed) {
    day[habitId] = true
  } else {
    delete day[habitId]
  }

  const next = { ...map }
  if (Object.keys(day).length === 0) {
    delete next[date]
  } else {
    next[date] = day
  }
  return next
}

export function toggleCompletion(map: CompletionMap, date: DateKey, habitId: HabitId) {
  return setCompletion(map, { habitId, date, completed: !isCompleted(map, date, habitId) })
}

export function getCompletedHabitIds(map: CompletionMap, date: DateKey): HabitId[] {
  return Object.keys(map[date] ?? {})
}

/** Removes every completion for a habit, e.g. when it is deleted. */
export function removeHabitCompletions(map: CompletionMap, habitId: HabitId): CompletionMap {
  let next = map
  for (const date of Object.keys(map) as DateKey[]) {
    if (isCompleted(map, date, habitId)) {
      next = setCompletion(next, { habitId, date, completed: false })
    }
  }
  return next
}
