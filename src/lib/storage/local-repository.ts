import { DEFAULT_HABITS } from '@/lib/habits'
import { DEFAULT_SETTINGS } from '@/lib/settings'

import { getBrowserStorage, type KeyValueStorage } from './key-value-storage'
import { createPersistedValue, type PersistenceError } from './persisted-value'
import type { AppRepository } from './repository'
import { parseCompletionMap, parseHabits, parseSettings } from './validators'

const NAMESPACE = 'habit-calendar'

/** Storage keys. `settings` is also read by the pre-paint theme script in index.html. */
export const STORAGE_KEYS = {
  habits: `${NAMESPACE}:habits`,
  completions: `${NAMESPACE}:completions`,
  settings: `${NAMESPACE}:settings`,
} as const

const SCHEMA_VERSION = 1

function reportError(error: PersistenceError) {
  console.warn(`[storage] ${error.message} (${error.key})`, error.cause)
}

export function createLocalRepository(
  storage: KeyValueStorage = getBrowserStorage(),
): AppRepository {
  const habits = createPersistedValue({
    storage,
    key: STORAGE_KEYS.habits,
    version: SCHEMA_VERSION,
    parse: parseHabits,
    fallback: () => [...DEFAULT_HABITS],
    onError: reportError,
  })

  const completions = createPersistedValue({
    storage,
    key: STORAGE_KEYS.completions,
    version: SCHEMA_VERSION,
    parse: parseCompletionMap,
    fallback: () => ({}),
    onError: reportError,
  })

  const settings = createPersistedValue({
    storage,
    key: STORAGE_KEYS.settings,
    version: SCHEMA_VERSION,
    parse: (data) => parseSettings(data, DEFAULT_SETTINGS),
    fallback: () => DEFAULT_SETTINGS,
    onError: reportError,
  })

  return {
    load: async () => ({
      habits: habits.read(),
      completions: completions.read(),
      settings: settings.read(),
    }),
    saveHabits: async (value) => habits.write(value),
    saveCompletions: async (value) => completions.write(value),
    saveSettings: async (value) => settings.write(value),
  }
}
