import type { Habit, HabitColor, HabitFilter, HabitIcon } from '@/types'

import { MAX_HABIT_NAME_LENGTH } from './defaults'
import { type HabitPromise, normalizePromise } from './promise'

export type HabitInput = { name: string; color: HabitColor; icon?: HabitIcon } & HabitPromise

export function normalizeHabitName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, MAX_HABIT_NAME_LENGTH)
}

export function createHabit(input: HabitInput): Habit {
  return {
    id: crypto.randomUUID(),
    name: normalizeHabitName(input.name),
    color: input.color,
    ...(input.icon ? { icon: input.icon } : {}),
    ...promiseFields(input),
    createdAt: new Date().toISOString(),
  }
}

/**
 * The promise fields to store: empty text and dates are dropped, and an
 * explicit "hidden" is kept only while there is something to hide.
 */
export function promiseFields(input: HabitPromise): HabitPromise {
  const promise = input.promise ? normalizePromise(input.promise) : ''
  return {
    ...(promise ? { promise } : {}),
    ...(input.targetDate ? { targetDate: input.targetDate } : {}),
    ...((promise || input.targetDate) && input.showPromise !== undefined
      ? { showPromise: input.showPromise }
      : {}),
  }
}

export function filterHabits(habits: readonly Habit[], filter: HabitFilter): readonly Habit[] {
  if (filter === 'all') return habits
  return habits.filter((habit) => habit.id === filter)
}

/** CSS custom property for a habit color token. */
export function habitColorVar(color: HabitColor): string {
  return `var(--color-habit-${color})`
}
