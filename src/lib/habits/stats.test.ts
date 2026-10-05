import { describe, expect, it } from 'vitest'

import type { CompletionMap, DateKey } from '@/types'

import { getMonthCount, getStreak, getStreakLinks } from './stats'

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

describe('streak links', () => {
  it('links consecutive days and labels the streak end', () => {
    const keys = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'] as DateKey[]
    const links = getStreakLinks(map, 'sport', keys)
    expect(links.get(keys[0]!)).toEqual({ joinsPrevious: true, joinsNext: true })
    expect(links.get(keys[1]!)).toEqual({ joinsPrevious: true, joinsNext: false, length: 4 })
    expect(links.has(keys[2]!)).toBe(false)
    // A single completed day has no streak label.
    expect(getStreakLinks(map, 'reading', keys).get(keys[3]!)).toEqual({
      joinsPrevious: false,
      joinsNext: false,
    })
  })
})
