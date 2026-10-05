import { useMemo } from 'react'

import { filterHabits } from '@/lib/habits'
import { useAppState } from '@/state'
import type { CalendarView, Habit } from '@/types'

/** Views that use the habit filter; Week and Day always show every habit. */
export const FILTERED_VIEWS: readonly CalendarView[] = ['year', 'month']

/** Habits the calendar should display under the current filter and view. */
export function useVisibleHabits(): readonly Habit[] {
  const { habits, habitFilter, view } = useAppState()
  const filter = FILTERED_VIEWS.includes(view) ? habitFilter : 'all'
  return useMemo(() => filterHabits(habits, filter), [habits, filter])
}
