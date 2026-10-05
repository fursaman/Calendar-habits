import type { Habit, HabitColor, HabitFilter } from '@/types'

export function createHabit(input: { name: string; color: HabitColor; icon?: string }): Habit {
  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    color: input.color,
    ...(input.icon ? { icon: input.icon } : {}),
    createdAt: new Date().toISOString(),
  }
}

export function getActiveHabits(habits: readonly Habit[]): Habit[] {
  return habits.filter((habit) => !habit.archivedAt)
}

export function filterHabits(habits: readonly Habit[], filter: HabitFilter): Habit[] {
  const active = getActiveHabits(habits)
  return filter === 'all' ? active : active.filter((habit) => habit.id === filter)
}

/** CSS custom property for a habit color, for inline styles such as SVG fills. */
export function habitColorVar(color: HabitColor): string {
  return `var(--color-habit-${color})`
}
