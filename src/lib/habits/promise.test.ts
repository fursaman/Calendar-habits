import { describe, expect, it } from 'vitest'

import type { DateKey } from '@/types'

import { promiseFields } from './habit'
import { isPromiseShown } from './promise'

const DATE = '2026-12-31' as DateKey

describe('promiseFields', () => {
  it('drops empty text and keeps the date', () => {
    expect(promiseFields({ promise: '   ', targetDate: DATE })).toEqual({
      targetDate: DATE,
    })
  })

  it('normalizes whitespace in the promise', () => {
    expect(promiseFields({ promise: '  Run   a  marathon ' })).toEqual({
      promise: 'Run a marathon',
    })
  })

  it('keeps the visibility choice only when there is a promise', () => {
    expect(promiseFields({ showPromise: false })).toEqual({})
    expect(promiseFields({ promise: 'Read', showPromise: false })).toEqual({
      promise: 'Read',
      showPromise: false,
    })
  })
})

describe('isPromiseShown', () => {
  it('shows set promises unless hidden', () => {
    expect(isPromiseShown({})).toBe(false)
    expect(isPromiseShown({ targetDate: DATE })).toBe(true)
    expect(isPromiseShown({ promise: 'Read', showPromise: false })).toBe(false)
  })
})
