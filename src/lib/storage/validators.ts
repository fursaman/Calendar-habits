import { isDateKey } from '@/lib/calendar'
import type {
  CalendarPreferences,
  CompletionMap,
  Habit,
  HabitColor,
  ThemePreference,
  UserSettings,
  Weekday,
} from '@/types'
import { CALENDAR_VIEWS, HABIT_COLORS, THEME_PREFERENCES } from '@/types'

/*
 * Runtime validation for data read from storage or a future API.
 * Each parser returns the typed value, or null when the input is invalid.
 */

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value)
}

function isWeekday(value: unknown): value is Weekday {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 6
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string'
}

export function parseHabit(value: unknown): Habit | null {
  if (!isRecord(value)) return null
  const { id, name, color, icon, createdAt, archivedAt } = value
  if (typeof id !== 'string' || id === '') return null
  if (typeof name !== 'string') return null
  if (!isOneOf<HabitColor>(HABIT_COLORS, color)) return null
  if (typeof createdAt !== 'string') return null
  if (!isOptionalString(icon) || !isOptionalString(archivedAt)) return null

  return {
    id,
    name,
    color,
    createdAt,
    ...(icon !== undefined ? { icon } : {}),
    ...(archivedAt !== undefined ? { archivedAt } : {}),
  }
}

export function parseHabits(value: unknown): Habit[] | null {
  if (!Array.isArray(value)) return null
  const habits: Habit[] = []
  for (const item of value) {
    const habit = parseHabit(item)
    if (!habit) return null
    habits.push(habit)
  }
  return habits
}

/** Drops malformed entries instead of rejecting the whole map, to keep history. */
export function parseCompletionMap(value: unknown): CompletionMap | null {
  if (!isRecord(value)) return null
  const map: CompletionMap = {}
  for (const [date, day] of Object.entries(value)) {
    if (!isDateKey(date) || !isRecord(day)) continue
    const entries = Object.entries(day).filter(([, done]) => done === true)
    if (entries.length > 0) {
      map[date] = Object.fromEntries(entries.map(([habitId]) => [habitId, true as const]))
    }
  }
  return map
}

function parseCalendarPreferences(
  value: unknown,
  fallback: CalendarPreferences,
): CalendarPreferences {
  if (!isRecord(value)) return fallback
  return {
    weekStartsOn: isWeekday(value.weekStartsOn) ? value.weekStartsOn : fallback.weekStartsOn,
    defaultView: isOneOf(CALENDAR_VIEWS, value.defaultView)
      ? value.defaultView
      : fallback.defaultView,
  }
}

/** Fills missing or invalid fields from defaults so new settings roll out smoothly. */
export function parseSettings(value: unknown, defaults: UserSettings): UserSettings | null {
  if (!isRecord(value)) return null
  return {
    theme: isOneOf<ThemePreference>(THEME_PREFERENCES, value.theme) ? value.theme : defaults.theme,
    calendar: parseCalendarPreferences(value.calendar, defaults.calendar),
  }
}
