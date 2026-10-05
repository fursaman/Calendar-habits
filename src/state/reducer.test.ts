import { describe, expect, it } from 'vitest'

import { DEFAULT_HABITS } from '@/lib/habits'
import { DEFAULT_SETTINGS } from '@/lib/settings'
import type { DateKey } from '@/types'

import { appReducer, createInitialState } from './reducer'

const initial = createInitialState(
  { habits: [...DEFAULT_HABITS], completions: {}, settings: DEFAULT_SETTINGS },
  new Date(2026, 9, 5, 23, 59),
)

describe('appReducer', () => {
  it('starts on today in local time with the default view', () => {
    expect(initial.activeDate).toBe('2026-10-05')
    expect(initial.view).toBe('month')
  })

  it('removing a habit clears its completions and filter', () => {
    const date = '2026-10-05' as DateKey
    let state = appReducer(initial, { type: 'completions/toggle', date, habitId: 'sport' })
    state = appReducer(state, { type: 'calendar/setHabitFilter', filter: 'sport' })
    state = appReducer(state, { type: 'habits/remove', habitId: 'sport' })
    expect(state.completions).toEqual({})
    expect(state.habitFilter).toBe('all')
    expect(state.habits.some((habit) => habit.id === 'sport')).toBe(false)
  })
})
