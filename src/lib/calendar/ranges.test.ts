import { describe, expect, it } from 'vitest'

import { toDateKey } from './date-key'
import { getPeriodKey, shiftDate } from './navigation'
import {
  chunkIntoWeeks,
  getFixedMonthGridDays,
  getMonthGridDays,
  getWeekdayOrder,
  getWeekDays,
} from './ranges'

describe('calendar ranges', () => {
  it('builds a Monday-first month grid of full weeks', () => {
    const days = getMonthGridDays(new Date(2026, 9, 15), 1)
    expect(days.length % 7).toBe(0)
    expect(toDateKey(days[0]!)).toBe('2026-09-28')
    expect(toDateKey(days.at(-1)!)).toBe('2026-11-01')
    expect(chunkIntoWeeks(days)).toHaveLength(days.length / 7)
  })

  it('respects the week start', () => {
    expect(toDateKey(getWeekDays(new Date(2026, 9, 7), 0)[0]!)).toBe('2026-10-04')
    expect(toDateKey(getWeekDays(new Date(2026, 9, 7), 1)[0]!)).toBe('2026-10-05')
    expect(getWeekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0])
  })

  it('crosses DST transitions without skipping days', () => {
    // Europe and US DST changes happen in late March / early November.
    const march = getMonthGridDays(new Date(2026, 2, 1), 1).map(toDateKey)
    expect(new Set(march).size).toBe(march.length)
    expect(march).toContain('2026-03-29')
  })

  it('shifts by view unit and clamps month ends', () => {
    expect(toDateKey(shiftDate(new Date(2026, 0, 31), 'month', 1))).toBe('2026-02-28')
    expect(toDateKey(shiftDate(new Date(2026, 9, 5), 'week', -1))).toBe('2026-09-28')
    expect(toDateKey(shiftDate(new Date(2028, 1, 29), 'year', 1))).toBe('2029-02-28')
    expect(toDateKey(shiftDate(new Date(2026, 11, 31), 'day', 1))).toBe('2027-01-01')
  })

  it('pads mini months to six weeks', () => {
    expect(getFixedMonthGridDays(new Date(2026, 1, 1), 1)).toHaveLength(42)
  })

  it('keys periods so same-period selection does not animate', () => {
    expect(getPeriodKey(new Date(2026, 9, 5), 'month', 1)).toBe(
      getPeriodKey(new Date(2026, 9, 31), 'month', 1),
    )
    expect(getPeriodKey(new Date(2026, 9, 4), 'week', 1)).not.toBe(
      getPeriodKey(new Date(2026, 9, 5), 'week', 1),
    )
  })
})
