import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '@/lib/settings'

import { parseCompletionMap, parseHabits, parseSettings } from './validators'

describe('validators', () => {
  it('rejects habits with unknown colors', () => {
    expect(parseHabits([{ id: 'a', name: 'A', color: 'pink', createdAt: 'x' }])).toBeNull()
    expect(parseHabits([{ id: 'a', name: 'A', color: 'reading', createdAt: 'x' }])).toHaveLength(1)
  })

  it('keeps valid completions and drops malformed ones', () => {
    expect(
      parseCompletionMap({
        '2026-10-05': { sport: true, reading: false },
        'not-a-date': { sport: true },
        '2026-10-06': 'oops',
      }),
    ).toEqual({ '2026-10-05': { sport: true } })
  })

  it('fills missing settings from defaults', () => {
    expect(parseSettings({ theme: 'dark' }, DEFAULT_SETTINGS)).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'dark',
    })
    expect(parseSettings({ theme: 'neon' }, DEFAULT_SETTINGS)?.theme).toBe('system')
  })
})
