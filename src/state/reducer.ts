import { todayKey } from '@/lib/calendar'
import { removeHabitCompletions, setCompletion, toggleCompletion } from '@/lib/habits'
import type { AppData } from '@/lib/storage'

import type { AppAction, AppState } from './types'

export function createInitialState(data: AppData, now: Date = new Date()): AppState {
  return {
    ...data,
    activeDate: todayKey(now),
    view: data.settings.calendar.defaultView,
    habitFilter: 'all',
    sheet: { type: 'closed' },
  }
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'calendar/setActiveDate':
      return { ...state, activeDate: action.date }
    case 'calendar/setView':
      return { ...state, view: action.view }
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
    case 'habits/remove':
      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== action.habitId),
        completions: removeHabitCompletions(state.completions, action.habitId),
        habitFilter: state.habitFilter === action.habitId ? 'all' : state.habitFilter,
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

    case 'sheet/open':
      return { ...state, sheet: action.sheet }
    case 'sheet/close':
      return { ...state, sheet: { type: 'closed' } }
  }
}
