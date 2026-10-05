/** Minimal synchronous key-value backend (localStorage-compatible). */
export type KeyValueStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function createMemoryStorage(): KeyValueStorage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  }
}

/**
 * Returns localStorage when it is usable, otherwise an in-memory fallback
 * (private browsing, disabled storage, or non-browser environments).
 */
export function getBrowserStorage(): KeyValueStorage {
  try {
    const probe = '__habit-calendar-probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return createMemoryStorage()
  }
}
