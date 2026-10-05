import type {
  CalendarView,
  CompletionMap,
  DateKey,
  Habit,
  HabitFilter,
  HabitId,
  UserSettings,
} from '@/types'

/** Snap positions of the habit panel. */
export const PANEL_SNAPS = ['collapsed', 'half', 'full'] as const
export type PanelSnap = (typeof PANEL_SNAPS)[number]

export type AppState = {
  /** Persisted */
  habits: Habit[]
  completions: CompletionMap
  settings: UserSettings
  /** Session-only UI state */
  activeDate: DateKey
  view: CalendarView
  habitFilter: HabitFilter
  panel: PanelSnap
  settingsOpen: boolean
  analyticsOpen: boolean
}

export type AppAction =
  | { type: 'calendar/setActiveDate'; date: DateKey }
  | { type: 'calendar/selectDate'; date: DateKey }
  | { type: 'calendar/setView'; view: CalendarView; date?: DateKey }
  | { type: 'calendar/setHabitFilter'; filter: HabitFilter }
  | { type: 'habits/add'; habit: Habit }
  | { type: 'habits/update'; habitId: HabitId; changes: Partial<Omit<Habit, 'id' | 'createdAt'>> }
  | { type: 'habits/remove'; habitId: HabitId }
  | { type: 'completions/toggle'; date: DateKey; habitId: HabitId }
  | { type: 'completions/set'; date: DateKey; habitId: HabitId; completed: boolean }
  | { type: 'settings/update'; changes: Partial<UserSettings> }
  | { type: 'panel/setSnap'; snap: PanelSnap }
  | { type: 'settings/setOpen'; open: boolean }
  | { type: 'analytics/setOpen'; open: boolean }
