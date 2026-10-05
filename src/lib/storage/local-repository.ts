import { DEFAULT_HABITS } from '@/lib/habits'
import { DEFAULT_SETTINGS } from '@/lib/settings'

import { getBrowserStorage, type KeyValueStorage } from './key-value-storage'
import { createPersistedValue, type PersistenceError } from './persisted-value'
import type { AppRepository } from './repository'
import { migrateHabits, parseCompletionMap, parseHabits, parseSettings } from './validators'

const NAMESPACE = 'habit-calendar'

/** Storage keys. `settings` is also read by the pre-paint theme script in index.html. */
export const STORAGE_KEYS = {
  habits: `${NAMESPACE}:habits`,
  completions: `${NAMESPACE}:completions`,
  settings: `${NAMESPACE}:settings`,
} as const

/** Bump a version and add a migration when a stored shape changes. */
const VERSIONS = { habits: 2, completions: 1, settings: 1 } as const

function reportError(error: PersistenceError) {
  console.warn(`[storage] ${error.message} (${error.key})`, error.cause)
}

export function createLocalRepository(
  storage: KeyValueStorage = getBrowserStorage(),
): AppRepository {
  const habits = createPersistedValue({
    storage,
    key: STORAGE_KEYS.habits,
    version: VERSIONS.habits,
    parse: parseHabits,
    migrate: migrateHabits,
    fallback: () => [...DEFAULT_HABITS],
    onError: reportError,
  })

  const completions = createPersistedValue({
    storage,
    key: STORAGE_KEYS.completions,
    version: VERSIONS.completions,
    parse: parseCompletionMap,
    fallback: () => ({}),
    onError: reportError,
  })

  const settings = createPersistedValue({
    storage,
    key: STORAGE_KEYS.settings,
    version: VERSIONS.settings,
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
