import type { DateKey } from './date'

/** Palette names; each maps to a `--color-habit-*` design token. */
export const HABIT_COLORS = [
  'green',
  'orange',
  'purple',
  'blue',
  'red',
  'pink',
  'yellow',
  'teal',
  'indigo',
  'graphite',
] as const
export type HabitColor = (typeof HABIT_COLORS)[number]

/** Icon names from the curated set in `lib/habits/icons`. */
export const HABIT_ICONS = [
  'dumbbell',
  'salad',
  'smartphone',
  'book-open',
  'footprints',
  'bike',
  'droplet',
  'moon',
  'brain',
  'heart',
  'leaf',
  'sun',
  'coffee',
  'pen-line',
  'music',
  'languages',
  'code',
  'wallet',
  'sprout',
  'target',
] as const
export type HabitIcon = (typeof HABIT_ICONS)[number]

export type HabitId = string

export type Habit = {
  id: HabitId
  name: string
  color: HabitColor
  icon?: HabitIcon
  /** ISO 8601 timestamp. */
  createdAt: string
}

export type HabitCompletion = {
  habitId: HabitId
  date: DateKey
  completed: boolean
}

/**
 * Completions indexed for O(1) lookup: `completions[date][habitId] === true`.
 * Only completed entries are stored; absence means not completed.
 * Days that didn't change keep their object identity, which lets calendar
 * cells skip re-rendering.
 */
export type CompletionMap = Record<DateKey, DayCompletions>
export type DayCompletions = Record<HabitId, true>

/** `'all'` or a single habit id. */
export type HabitFilter = 'all' | HabitId
