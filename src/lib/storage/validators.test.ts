import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '@/lib/settings'

import { migrateHabits, parseCompletionMap, parseHabits, parseSettings } from './validators'

describe('validators', () => {
  it('drops invalid and duplicate habits but keeps the rest', () => {
    expect(
      parseHabits([
        { id: 'a', name: 'A', color: 'neon', createdAt: 'x' },
        { id: 'b', name: 'B', color: 'blue', icon: 'gone', createdAt: 'x' },
        { id: 'b', name: 'B2', color: 'blue', createdAt: 'x' },
      ]),
    ).toEqual([{ id: 'b', name: 'B', color: 'blue', createdAt: 'x' }])
    expect(parseHabits('nope')).toBeNull()
  })

  it('migrates v1 habit colors to palette names', () => {
    const migrated = migrateHabits([{ id: 's', name: 'S', color: 'sport', createdAt: 'x' }], 1)
    expect(parseHabits(migrated)?.[0]?.color).toBe('green')
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
