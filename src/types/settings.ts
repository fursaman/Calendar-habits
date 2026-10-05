import type { Weekday } from './date'

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const
export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

export const CALENDAR_VIEWS = ['year', 'month', 'week', 'day'] as const
export type CalendarView = (typeof CALENDAR_VIEWS)[number]

export type CalendarPreferences = {
  weekStartsOn: Weekday
  defaultView: CalendarView
}

export type UserSettings = {
  theme: ThemePreference
  calendar: CalendarPreferences
  /** Play a short sound when a habit is completed. */
  sounds: boolean
}
