import { describe, expect, it } from 'vitest'

import type { CompletionMap, DateKey, Habit } from '@/types'

import { getActivityBuckets, getHabitBalance } from './analytics'

const habits: Habit[] = [
  { id: 'a', name: 'A', color: 'green', createdAt: '' },
  { id: 'b', name: 'B', color: 'blue', createdAt: '' },
]
const map: CompletionMap = {
  ['2026-10-01' as DateKey]: { a: true, b: true },
  ['2026-10-02' as DateKey]: { a: true },
  ['2026-11-01' as DateKey]: { b: true },
}

describe('analytics', () => {
  it('buckets a month by day and a year by month', () => {
    const month = getActivityBuckets(map, habits, new Date(2026, 9, 15), 'month', 1)
    expect(month).toHaveLength(31)
    expect(month[0]).toMatchObject({ total: 2, counts: { a: 1, b: 1 } })

    const year = getActivityBuckets(map, habits, new Date(2026, 9, 15), 'year', 1)
    expect(year).toHaveLength(12)
    expect(year[9]?.total).toBe(3)
    expect(year[10]?.counts).toEqual({ a: 0, b: 1 })
  })

  it('measures balance only over days that have happened', () => {
    const balance = getHabitBalance(
      map,
      habits,
      new Date(2026, 9, 15),
      'month',
      1,
      '2026-10-04' as DateKey,
    )
    expect(balance.map((b) => [b.completed, b.possible])).toEqual([
      [2, 4],
      [1, 4],
    ])
    expect(balance[0]?.ratio).toBe(0.5)
  })
})
