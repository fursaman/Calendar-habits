import type { Habit, HabitColor } from '@/types'

const CREATED_AT = '2026-01-01T00:00:00.000Z'

/** Starter habits seeded on first launch. Ids are stable so data survives renames. */
export const DEFAULT_HABITS: readonly Habit[] = [
  { id: 'sport', name: 'Sport', color: 'green', icon: 'dumbbell', createdAt: CREATED_AT },
  {
    id: 'healthy-eating',
    name: 'Healthy Eating',
    color: 'orange',
    icon: 'salad',
    createdAt: CREATED_AT,
  },
  {
    id: 'no-doomscrolling',
    name: 'No Doomscrolling',
    color: 'purple',
    icon: 'smartphone',
    createdAt: CREATED_AT,
  },
  { id: 'reading', name: 'Reading', color: 'blue', icon: 'book-open', createdAt: CREATED_AT },
]

export const MAX_HABIT_NAME_LENGTH = 40
export const MAX_PROMISE_LENGTH = 120

/** First palette color not used by an existing habit, for new habits. */
export function pickNextColor(used: readonly HabitColor[], palette: readonly HabitColor[]) {
  return palette.find((color) => !used.includes(color)) ?? palette[0]!
}
