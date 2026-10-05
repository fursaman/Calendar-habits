import { addDays } from 'date-fns'
import { useCallback } from 'react'

import { fromDateKey, toDateKey, todayKey } from '@/lib/calendar'
import { getStreak, isCompleted } from '@/lib/habits'
import { playCompletionSound } from '@/lib/sound'
import { useAppActions, useAppState } from '@/state'
import type { DateKey, HabitId } from '@/types'

/** Smallest streak worth celebrating. */
const MIN_CELEBRATED_STREAK = 2

/**
 * Toggles a habit for a day. Checking it plays the chime; checking *today*
 * when yesterday was also done celebrates the streak. Past days just update
 * streak counts, which are derived from completions everywhere.
 */
export function useToggleHabit() {
  const { completions, settings } = useAppState()
  const { toggleCompletion, celebrate } = useAppActions()
  return useCallback(
    (date: DateKey, habitId: HabitId) => {
      const completing = !isCompleted(completions, date, habitId)
      if (completing && settings.sounds) playCompletionSound()
      toggleCompletion({ date, habitId })

      if (!completing || date !== todayKey()) return
      const yesterday = toDateKey(addDays(fromDateKey(date), -1))
      if (!isCompleted(completions, yesterday, habitId)) return
      const days = getStreak(completions, habitId, yesterday) + 1
      if (days >= MIN_CELEBRATED_STREAK) celebrate({ habitId, date, days })
    },
    [completions, settings.sounds, toggleCompletion, celebrate],
  )
}
