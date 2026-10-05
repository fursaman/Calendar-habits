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
    expect(initial.habitFilter).toBe('sport')
  })

  it('selecting a date reveals the habit panel', () => {
    const state = appReducer(initial, {
      type: 'calendar/selectDate',
      date: '2026-10-07' as DateKey,
    })
    expect(state.activeDate).toBe('2026-10-07')
    expect(state.panel).toBe('half')
    const full = appReducer(
      { ...state, panel: 'full' },
      {
        type: 'calendar/selectDate',
        date: '2026-10-08' as DateKey,
      },
    )
    expect(full.panel).toBe('full')
  })

  it('shows and dismisses a streak celebration', () => {
    const celebration = { habitId: 'sport', date: '2026-10-05' as DateKey, days: 3 }
    const shown = appReducer(initial, { type: 'celebration/show', celebration })
    expect(shown.celebration).toEqual(celebration)
    expect(appReducer(shown, { type: 'celebration/dismiss' }).celebration).toBeNull()
  })

  it('reorders habits', () => {
    const state = appReducer(initial, { type: 'habits/reorder', habitId: 'reading', toIndex: 0 })
    expect(state.habits.map((habit) => habit.id)).toEqual([
      'reading',
      'sport',
      'healthy-eating',
      'no-doomscrolling',
    ])
  })

  it('removing a habit clears its completions and filter', () => {
    const date = '2026-10-05' as DateKey
    let state = appReducer(initial, { type: 'completions/toggle', date, habitId: 'sport' })
    state = appReducer(state, { type: 'calendar/setHabitFilter', filter: 'sport' })
    state = appReducer(state, { type: 'habits/remove', habitId: 'sport' })
    expect(state.completions).toEqual({})
    // Falls back to the first remaining habit.
    expect(state.habitFilter).toBe('healthy-eating')
    expect(state.habits.some((habit) => habit.id === 'sport')).toBe(false)
  })
})
