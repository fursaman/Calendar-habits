import type {
  CalendarView,
  CompletionMap,
  DateKey,
  Habit,
  HabitFilter,
  HabitId,
  PremiumPurchase,
  PremiumStatus,
  UserSettings,
} from '@/types'

export type StreakCelebration = { habitId: HabitId; date: DateKey; days: number }

/** Snap positions of the habit panel. */
export const PANEL_SNAPS = ['collapsed', 'half', 'full'] as const
export type PanelSnap = (typeof PANEL_SNAPS)[number]

export type AppState = {
  /** Persisted */
  habits: Habit[]
  completions: CompletionMap
  settings: UserSettings
  premium: PremiumStatus
  /** Session-only UI state */
  activeDate: DateKey
  view: CalendarView
  habitFilter: HabitFilter
  panel: PanelSnap
  settingsOpen: boolean
  analyticsOpen: boolean
  paywallOpen: boolean
  /** Settings closes while the paywall is open and comes back when it closes. */
  paywallFromSettings: boolean
  /** Streak popup shown after checking today's habit; null when hidden. */
  celebration: StreakCelebration | null
}

export type AppAction =
  | { type: 'calendar/setActiveDate'; date: DateKey }
  | { type: 'calendar/selectDate'; date: DateKey }
  | { type: 'calendar/setView'; view: CalendarView; date?: DateKey }
  | { type: 'calendar/setHabitFilter'; filter: HabitFilter }
  | { type: 'habits/add'; habit: Habit }
  | { type: 'habits/update'; habitId: HabitId; changes: Partial<Omit<Habit, 'id' | 'createdAt'>> }
  | { type: 'habits/remove'; habitId: HabitId }
  | { type: 'habits/reorder'; habitId: HabitId; toIndex: number }
  | { type: 'completions/toggle'; date: DateKey; habitId: HabitId }
  | { type: 'completions/set'; date: DateKey; habitId: HabitId; completed: boolean }
  | { type: 'settings/update'; changes: Partial<UserSettings> }
  | { type: 'panel/setSnap'; snap: PanelSnap }
  | { type: 'settings/setOpen'; open: boolean }
  | { type: 'analytics/setOpen'; open: boolean }
  | { type: 'paywall/setOpen'; open: boolean }
  | { type: 'premium/purchase'; purchase: PremiumPurchase }
  | { type: 'premium/reset' }
  | { type: 'celebration/show'; celebration: StreakCelebration }
  | { type: 'celebration/dismiss' }
