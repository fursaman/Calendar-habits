import type { Habit, HabitColor, HabitFilter, HabitIcon } from '@/types'

import { MAX_HABIT_NAME_LENGTH } from './defaults'

export type HabitInput = { name: string; color: HabitColor; icon?: HabitIcon }

export function normalizeHabitName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, MAX_HABIT_NAME_LENGTH)
}

export function createHabit(input: HabitInput): Habit {
  return {
    id: crypto.randomUUID(),
    name: normalizeHabitName(input.name),
    color: input.color,
    ...(input.icon ? { icon: input.icon } : {}),
    createdAt: new Date().toISOString(),
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
