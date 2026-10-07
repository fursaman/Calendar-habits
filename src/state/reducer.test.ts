import { describe, expect, it } from 'vitest'

import { DEFAULT_HABITS } from '@/lib/habits'
import { DEFAULT_SETTINGS } from '@/lib/settings'
import type { DateKey } from '@/types'

import { appReducer, createInitialState } from './reducer'

const initial = createInitialState(
  {
    habits: [...DEFAULT_HABITS],
    completions: {},
    settings: DEFAULT_SETTINGS,
    premium: { trialStartedOn: '2026-10-05' as DateKey, purchase: null },
  },
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

  it('records a purchase and closes the paywall', () => {
    const open = appReducer(initial, { type: 'paywall/setOpen', open: true })
    const purchase = { plan: 'lifetime' as const, purchasedOn: '2026-10-07' as DateKey }
    const bought = appReducer(open, { type: 'premium/purchase', purchase })
    expect(bought.premium.purchase).toEqual(purchase)
    expect(bought.paywallOpen).toBe(false)
  })

  it('hides Settings behind the paywall and brings it back on close', () => {
    const settings = appReducer(initial, { type: 'settings/setOpen', open: true })
    const paywall = appReducer(settings, { type: 'paywall/setOpen', open: true })
    expect(paywall.settingsOpen).toBe(false)
    expect(paywall.paywallOpen).toBe(true)
    const closed = appReducer(paywall, { type: 'paywall/setOpen', open: false })
    expect(closed.settingsOpen).toBe(true)
    expect(closed.paywallOpen).toBe(false)
  })

  it('returns to Settings after a purchase and can reset it for testing', () => {
    const settings = appReducer(initial, { type: 'settings/setOpen', open: true })
    const paywall = appReducer(settings, { type: 'paywall/setOpen', open: true })
    const purchase = { plan: 'yearly' as const, purchasedOn: '2026-10-07' as DateKey }
    const bought = appReducer(paywall, { type: 'premium/purchase', purchase })
    expect(bought.settingsOpen).toBe(true)
    expect(appReducer(bought, { type: 'premium/reset' }).premium.purchase).toBeNull()
  })
})
