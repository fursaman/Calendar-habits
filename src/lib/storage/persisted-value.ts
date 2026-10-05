import type { KeyValueStorage } from './key-value-storage'

/** Stored shape: data wrapped with a schema version for future migrations. */
type Envelope = { version: number; data: unknown }

export type PersistedValueOptions<T> = {
  storage: KeyValueStorage
  key: string
  version: number
  /** Returns the value if valid, or `null` to treat it as corrupted. */
  parse: (data: unknown) => T | null
  fallback: () => T
  /** Upgrades data written by an older version. Return `null` if not possible. */
  migrate?: (data: unknown, fromVersion: number) => unknown
  onError?: (error: PersistenceError) => void
}

export class PersistenceError extends Error {
  readonly key: string

  constructor(message: string, key: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'PersistenceError'
    this.key = key
  }
}

export type PersistedValue<T> = {
  read(): T
  write(value: T): void
  update(updater: (current: T) => T): T
  clear(): void
}

function isEnvelope(value: unknown): value is Envelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof value.version === 'number' &&
    'data' in value
  )
}

/**
 * A single typed, validated, versioned value in key-value storage.
 *
 * Corrupted or invalid data never crashes the app: the raw value is copied
 * to a `<key>:corrupted` backup for recovery, and the fallback is returned.
 */
export function createPersistedValue<T>(options: PersistedValueOptions<T>): PersistedValue<T> {
  const { storage, key, version, parse, fallback, migrate, onError } = options

  function quarantine(raw: string, reason: string, cause?: unknown) {
    try {
      storage.setItem(`${key}:corrupted`, raw)
    } catch {
      // Backup is best-effort; storage may be full.
    }
    onError?.(new PersistenceError(reason, key, { cause }))
  }

  function read(): T {
    let raw: string | null
    try {
      raw = storage.getItem(key)
    } catch (cause) {
      onError?.(new PersistenceError('Storage is not readable', key, { cause }))
      return fallback()
    }
    if (raw === null) return fallback()

    let envelope: unknown
    try {
      envelope = JSON.parse(raw)
    } catch (cause) {
      quarantine(raw, 'Stored value is not valid JSON', cause)
      return fallback()
    }

    if (!isEnvelope(envelope)) {
      quarantine(raw, 'Stored value has an unknown shape')
      return fallback()
    }

    let data = envelope.data
    if (envelope.version !== version) {
      data = envelope.version < version && migrate ? migrate(data, envelope.version) : null
    }

    const parsed = data === null ? null : parse(data)
    if (parsed === null) {
      quarantine(raw, `Stored value failed validation (version ${envelope.version})`)
      return fallback()
    }
    return parsed
  }

  function write(value: T) {
    const envelope: Envelope = { version, data: value }
    try {
      storage.setItem(key, JSON.stringify(envelope))
    } catch (cause) {
      onError?.(new PersistenceError('Failed to write to storage', key, { cause }))
    }
  }

  return {
    read,
    write,
    update(updater) {
      const next = updater(read())
      write(next)
      return next
    },
    clear() {
      storage.removeItem(key)
    },
  }
}
