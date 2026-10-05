import { describe, expect, it } from 'vitest'

import { fromDateKey, isDateKey, toDateKey } from './date-key'

describe('date keys', () => {
  it('uses local calendar fields, not UTC', () => {
    // 23:30 local on Jan 31 must stay Jan 31 in every timezone.
    expect(toDateKey(new Date(2026, 0, 31, 23, 30))).toBe('2026-01-31')
    expect(toDateKey(new Date(2026, 0, 1, 0, 15))).toBe('2026-01-01')
  })

  it('round-trips through local midnight', () => {
    const date = fromDateKey(toDateKey(new Date(2026, 9, 5, 18)))
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(9)
    expect(date.getDate()).toBe(5)
    expect(date.getHours()).toBe(0)
  })

  it('validates format and real dates', () => {
    expect(isDateKey('2026-02-28')).toBe(true)
    expect(isDateKey('2028-02-29')).toBe(true)
    expect(isDateKey('2026-02-30')).toBe(false)
    expect(isDateKey('2026-2-3')).toBe(false)
    expect(isDateKey(20260203)).toBe(false)
  })
})
