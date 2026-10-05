import { describe, expect, it, vi } from 'vitest'

import { createMemoryStorage } from './key-value-storage'
import { createPersistedValue } from './persisted-value'

function setup(version = 1) {
  const storage = createMemoryStorage()
  const onError = vi.fn()
  const value = createPersistedValue<number[]>({
    storage,
    key: 'test',
    version,
    parse: (data) =>
      Array.isArray(data) && data.every((n) => typeof n === 'number') ? data : null,
    fallback: () => [],
    migrate: (data, from) => (from === 1 && Array.isArray(data) ? data.map(Number) : null),
    onError,
  })
  return { storage, value, onError }
}

describe('createPersistedValue', () => {
  it('returns the fallback when empty and round-trips writes', () => {
    const { value } = setup()
    expect(value.read()).toEqual([])
    value.write([1, 2])
    expect(value.read()).toEqual([1, 2])
    expect(value.update((current) => [...current, 3])).toEqual([1, 2, 3])
  })

  it('recovers from invalid JSON and backs up the raw value', () => {
    const { storage, value, onError } = setup()
    storage.setItem('test', '{not json')
    expect(value.read()).toEqual([])
    expect(storage.getItem('test:corrupted')).toBe('{not json')
    expect(onError).toHaveBeenCalledOnce()
  })

  it('recovers from data that fails validation', () => {
    const { storage, value } = setup()
    storage.setItem('test', JSON.stringify({ version: 1, data: ['x'] }))
    expect(value.read()).toEqual([])
  })

  it('migrates older versions', () => {
    const { storage, value } = setup(2)
    storage.setItem('test', JSON.stringify({ version: 1, data: ['1', '2'] }))
    expect(value.read()).toEqual([1, 2])
  })
})
