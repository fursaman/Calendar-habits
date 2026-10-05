import { useMemo } from 'react'

import { filterHabits } from '@/lib/habits'
import { useAppState } from '@/state'
import type { Habit } from '@/types'

/** Habits the calendar should display under the current filter. */
export function useVisibleHabits(): readonly Habit[] {
  const { habits, habitFilter } = useAppState()
  return useMemo(() => filterHabits(habits, habitFilter), [habits, habitFilter])
}
