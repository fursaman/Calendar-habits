import { todayKey } from '@/lib/calendar'
import { removeHabitCompletions, setCompletion, toggleCompletion } from '@/lib/habits'
import type { AppData } from '@/lib/storage'

import type { AppAction, AppState } from './types'

export function createInitialState(data: AppData, now: Date = new Date()): AppState {
  return {
    ...data,
    activeDate: todayKey(now),
    view: data.settings.calendar.defaultView,
    // Start focused on one habit; "All Habits" stays one tap away.
    habitFilter: data.habits[0]?.id ?? 'all',
    panel: 'collapsed',
    settingsOpen: false,
    analyticsOpen: false,
    paywallOpen: false,
    paywallFromSettings: false,
    celebration: null,
  }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'calendar/setActiveDate':
      return state.activeDate === action.date ? state : { ...state, activeDate: action.date }
    case 'calendar/selectDate':
      // Selecting a day always reveals its habits.
      return {
        ...state,
        activeDate: action.date,
        panel: state.panel === 'collapsed' ? 'half' : state.panel,
      }
    case 'calendar/setView':
      return { ...state, view: action.view, activeDate: action.date ?? state.activeDate }
    case 'calendar/setHabitFilter':
      return { ...state, habitFilter: action.filter }

    case 'habits/add':
      return { ...state, habits: [...state.habits, action.habit] }
    case 'habits/update':
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === action.habitId ? { ...habit, ...action.changes } : habit,
        ),
      }
    case 'habits/reorder': {
      const from = state.habits.findIndex((habit) => habit.id === action.habitId)
      if (from === -1 || from === action.toIndex) return state
      const habits = [...state.habits]
      const [moved] = habits.splice(from, 1)
      habits.splice(Math.max(0, Math.min(action.toIndex, habits.length)), 0, moved!)
      return { ...state, habits }
    }
    case 'habits/remove': {
      const habits = state.habits.filter((habit) => habit.id !== action.habitId)
      return {
        ...state,
        habits,
        completions: removeHabitCompletions(state.completions, action.habitId),
        habitFilter:
          state.habitFilter === action.habitId ? (habits[0]?.id ?? 'all') : state.habitFilter,
      }
    }

    case 'completions/toggle':
      return {
        ...state,
        completions: toggleCompletion(state.completions, action.date, action.habitId),
      }
    case 'completions/set':
      return {
        ...state,
        completions: setCompletion(state.completions, {
          date: action.date,
          habitId: action.habitId,
          completed: action.completed,
        }),
      }

    case 'settings/update':
      return { ...state, settings: { ...state.settings, ...action.changes } }

    case 'panel/setSnap':
      return state.panel === action.snap ? state : { ...state, panel: action.snap }
    case 'settings/setOpen':
      return { ...state, settingsOpen: action.open }
    case 'analytics/setOpen':
      return { ...state, analyticsOpen: action.open }
    case 'paywall/setOpen':
      return action.open
        ? {
            ...state,
            paywallOpen: true,
            paywallFromSettings: state.settingsOpen,
            settingsOpen: false,
          }
        : closePaywall(state)
    case 'premium/purchase':
      return closePaywall({
        ...state,
        premium: { ...state.premium, purchase: action.purchase },
      })
    case 'premium/reset':
      return { ...state, premium: { ...state.premium, purchase: null } }
    case 'celebration/show':
      return { ...state, celebration: action.celebration }
    case 'celebration/dismiss':
      return state.celebration ? { ...state, celebration: null } : state
  }
}

/** Closes the paywall and brings Settings back if the paywall was opened from there. */
function closePaywall(state: AppState): AppState {
  return {
    ...state,
    paywallOpen: false,
    paywallFromSettings: false,
    settingsOpen: state.settingsOpen || state.paywallFromSettings,
  }
}
