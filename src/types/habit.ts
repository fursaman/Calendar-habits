import type { DateKey } from './date'

/** Token names for habit colors; map to `--color-habit-*` design tokens. */
export const HABIT_COLORS = ['sport', 'healthy-eating', 'no-doomscrolling', 'reading'] as const
export type HabitColor = (typeof HABIT_COLORS)[number]

export type HabitId = string

export type Habit = {
  id: HabitId
  name: string
  color: HabitColor
  icon?: string
  /** ISO 8601 timestamp. */
  createdAt: string
  /** ISO 8601 timestamp; archived habits are hidden but keep their history. */
  archivedAt?: string
}

export type HabitCompletion = {
  habitId: HabitId
  date: DateKey
  completed: boolean
}

/**
 * Completions indexed for O(1) lookup: `completions[date][habitId] === true`.
 * Only completed entries are stored; absence means not completed.
 */
export type CompletionMap = Record<DateKey, Record<HabitId, true>>

/** `'all'` or a single habit id. */
export type HabitFilter = 'all' | HabitId
