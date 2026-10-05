import type {
  CompletionMap,
  DateKey,
  DayCompletions,
  Habit,
  HabitCompletion,
  HabitId,
} from '@/types'

const EMPTY_DAY: DayCompletions = Object.freeze({}) as DayCompletions

/** The completions for one day; a shared empty object when there are none. */
export function getDay(map: CompletionMap, date: DateKey): DayCompletions {
  return map[date] ?? EMPTY_DAY
}

export function isCompleted(map: CompletionMap, date: DateKey, habitId: HabitId): boolean {
  return map[date]?.[habitId] === true
}

/** Returns a new map with the completion set; never mutates the input. */
export function setCompletion(
  map: CompletionMap,
  { habitId, date, completed }: HabitCompletion,
): CompletionMap {
  if (isCompleted(map, date, habitId) === completed) return map

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

/** Habits from `habits` that are completed on the given day, in habit order. */
export function getCompletedHabits(day: DayCompletions, habits: readonly Habit[]): Habit[] {
  return habits.filter((habit) => day[habit.id] === true)
}

/** Removes every completion for a habit, e.g. when it is deleted. */
export function removeHabitCompletions(map: CompletionMap, habitId: HabitId): CompletionMap {
  let next = map
  for (const date of Object.keys(map) as DateKey[]) {
    next = setCompletion(next, { habitId, date, completed: false })
  }
  return next
}

/** Flattens the map into backend-friendly records. */
export function toCompletionList(map: CompletionMap): HabitCompletion[] {
  return Object.entries(map).flatMap(([date, day]) =>
    Object.keys(day).map((habitId) => ({ habitId, date: date as DateKey, completed: true })),
  )
}
