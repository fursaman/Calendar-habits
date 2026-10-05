/**
 * Canonical calendar-day key in local time: `YYYY-MM-DD`.
 * Branded so arbitrary strings can't be passed where a validated key is expected.
 */
export type DateKey = string & { readonly __brand: 'DateKey' }

/** Day of week, 0 = Sunday ... 6 = Saturday (matches Date#getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6
