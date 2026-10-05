import { describe, expect, it } from 'vitest'

import type { CompletionMap, DateKey } from '@/types'

import { isCompleted, removeHabitCompletions, toggleCompletion } from './completions'

const day = '2026-10-05' as DateKey

describe('completions', () => {
  it('toggles without mutating and prunes empty days', () => {
    const empty: CompletionMap = {}
    const done = toggleCompletion(empty, day, 'sport')
    expect(isCompleted(done, day, 'sport')).toBe(true)
    expect(empty).toEqual({})

    const undone = toggleCompletion(done, day, 'sport')
    expect(undone).toEqual({})
  })

  it('removes all completions for a habit', () => {
    let map: CompletionMap = {}
    map = toggleCompletion(map, day, 'sport')
    map = toggleCompletion(map, day, 'reading')
    map = toggleCompletion(map, '2026-10-06' as DateKey, 'sport')
    expect(removeHabitCompletions(map, 'sport')).toEqual({ [day]: { reading: true } })
  })
})
