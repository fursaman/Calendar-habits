import { useCallback } from 'react'

import { isCompleted } from '@/lib/habits'
import { playCompletionSound } from '@/lib/sound'
import { useAppActions, useAppState } from '@/state'
import type { DateKey, HabitId } from '@/types'

/** Toggles a habit for a day, with the completion chime when it gets checked. */
export function useToggleHabit() {
  const { completions, settings } = useAppState()
  const { toggleCompletion } = useAppActions()
  return useCallback(
    (date: DateKey, habitId: HabitId) => {
      if (settings.sounds && !isCompleted(completions, date, habitId)) playCompletionSound()
      toggleCompletion({ date, habitId })
    },
    [completions, settings.sounds, toggleCompletion],
  )
}
