import { describe, expect, it } from 'vitest'

import type { CompletionMap, DateKey } from '@/types'

import { getMonthCount, getStreak } from './stats'

const map: CompletionMap = {
  ['2026-09-29' as DateKey]: { sport: true },
  ['2026-09-30' as DateKey]: { sport: true },
  ['2026-10-01' as DateKey]: { sport: true },
  ['2026-10-02' as DateKey]: { sport: true, reading: true },
  ['2026-10-04' as DateKey]: { reading: true },
}

describe('habit stats', () => {
  it('counts a streak across a month boundary', () => {
    expect(getStreak(map, 'sport', '2026-10-02' as DateKey)).toBe(4)
  })

  it('keeps yesterday’s streak alive until today is marked', () => {
    expect(getStreak(map, 'sport', '2026-10-03' as DateKey)).toBe(4)
    expect(getStreak(map, 'sport', '2026-10-04' as DateKey)).toBe(0)
  })

  it('counts completions in the month', () => {
    expect(getMonthCount(map, 'sport', '2026-10-15' as DateKey)).toBe(2)
    expect(getMonthCount(map, 'reading', '2026-10-15' as DateKey)).toBe(2)
  })
})
