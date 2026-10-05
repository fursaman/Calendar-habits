import { useMemo } from 'react'

import { type ChoiceChip, ChoiceChips } from '@/components/ui'
import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'

import { HabitIndicator } from './HabitIndicator'

/** Filters which habits the calendar shows. Display only; never changes data. */
export function HabitFilterBar({ className }: { className?: string }) {
  const { habits, habitFilter } = useAppState()
  const { setHabitFilter } = useAppActions()

  const options = useMemo<ChoiceChip<string>[]>(
    () => [
      { value: 'all', label: 'All Habits' },
      ...habits.map((habit) => ({
        value: habit.id,
        label: habit.name,
        accentColor: habitColorVar(habit.color),
        leading: <HabitIndicator habit={habit} size="lg" />,
      })),
    ],
    [habits],
  )

  if (habits.length === 0) return null

  return (
    <ChoiceChips
      label="Show habits"
      value={habitFilter}
      onValueChange={setHabitFilter}
      options={options}
      className={cn('px-4', className)}
    />
  )
}
