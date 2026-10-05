import type {
  CalendarView,
  CompletionMap,
  DateKey,
  Habit,
  HabitFilter,
  HabitId,
  UserSettings,
} from '@/types'

/** Which bottom sheet is open, with the context it needs. */
export type BottomSheetState =
  | { type: 'closed' }
  | { type: 'day'; date: DateKey }
  | { type: 'habit-editor'; habitId?: HabitId }
  | { type: 'settings' }

export type AppState = {
  /** Persisted */
  habits: Habit[]
  completions: CompletionMap
  settings: UserSettings
  /** Session-only UI state */
  activeDate: DateKey
  view: CalendarView
  habitFilter: HabitFilter
  sheet: BottomSheetState
}

export type AppAction =
  | { type: 'calendar/setActiveDate'; date: DateKey }
  | { type: 'calendar/setView'; view: CalendarView }
  | { type: 'calendar/setHabitFilter'; filter: HabitFilter }
  | { type: 'habits/add'; habit: Habit }
  | { type: 'habits/update'; habitId: HabitId; changes: Partial<Omit<Habit, 'id'>> }
  | { type: 'habits/remove'; habitId: HabitId }
  | { type: 'completions/toggle'; date: DateKey; habitId: HabitId }
  | { type: 'completions/set'; date: DateKey; habitId: HabitId; completed: boolean }
  | { type: 'settings/update'; changes: Partial<UserSettings> }
  | { type: 'sheet/open'; sheet: Exclude<BottomSheetState, { type: 'closed' }> }
  | { type: 'sheet/close' }
