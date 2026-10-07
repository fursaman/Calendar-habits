import { use, useMemo } from 'react'

import { fromDateKey, type NavigationDirection, shiftDate, toDateKey } from '@/lib/calendar'
import { createHabit, type HabitInput } from '@/lib/habits'
import type { CalendarView, DateKey } from '@/types'

import { AppDispatchContext, AppStateContext } from './context'
import type { AppAction, AppState } from './types'

export function useAppState(): AppState {
  const state = use(AppStateContext)
  if (!state) throw new Error('useAppState must be used inside <AppStateProvider>')
  return state
}

export function useAppDispatch() {
  const dispatch = use(AppDispatchContext)
  if (!dispatch) throw new Error('useAppDispatch must be used inside <AppStateProvider>')
  return dispatch
}

type Payload<T extends AppAction['type']> = Omit<Extract<AppAction, { type: T }>, 'type'>

/** Stable, named action creators so components don't build action objects by hand. */
export function useAppActions() {
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      setActiveDate: (date: DateKey) => dispatch({ type: 'calendar/setActiveDate', date }),
      /** Sets the active date and reveals the habit panel. */
      selectDate: (date: DateKey) => dispatch({ type: 'calendar/selectDate', date }),
      setView: (view: CalendarView, date?: DateKey) =>
        dispatch({ type: 'calendar/setView', view, ...(date ? { date } : {}) }),
      setHabitFilter: (filter: Payload<'calendar/setHabitFilter'>['filter']) =>
        dispatch({ type: 'calendar/setHabitFilter', filter }),

      addHabit: (input: HabitInput) => dispatch({ type: 'habits/add', habit: createHabit(input) }),
      updateHabit: (payload: Payload<'habits/update'>) =>
        dispatch({ type: 'habits/update', ...payload }),
      removeHabit: (habitId: Payload<'habits/remove'>['habitId']) =>
        dispatch({ type: 'habits/remove', habitId }),
      reorderHabit: (payload: Payload<'habits/reorder'>) =>
        dispatch({ type: 'habits/reorder', ...payload }),

      toggleCompletion: (payload: Payload<'completions/toggle'>) =>
        dispatch({ type: 'completions/toggle', ...payload }),
      setCompletion: (payload: Payload<'completions/set'>) =>
        dispatch({ type: 'completions/set', ...payload }),

      updateSettings: (changes: Payload<'settings/update'>['changes']) =>
        dispatch({ type: 'settings/update', changes }),

      setPanel: (snap: Payload<'panel/setSnap'>['snap']) =>
        dispatch({ type: 'panel/setSnap', snap }),
      setSettingsOpen: (open: boolean) => dispatch({ type: 'settings/setOpen', open }),
      setAnalyticsOpen: (open: boolean) => dispatch({ type: 'analytics/setOpen', open }),
      setPaywallOpen: (open: boolean) => dispatch({ type: 'paywall/setOpen', open }),
      recordPurchase: (purchase: Payload<'premium/purchase'>['purchase']) =>
        dispatch({ type: 'premium/purchase', purchase }),
      celebrate: (celebration: Payload<'celebration/show'>['celebration']) =>
        dispatch({ type: 'celebration/show', celebration }),
      dismissCelebration: () => dispatch({ type: 'celebration/dismiss' }),
    }),
    [dispatch],
  )
}

/** Active date as a Date plus view-aware navigation. */
export function useCalendarNavigation() {
  const { activeDate, view } = useAppState()
  const { setActiveDate } = useAppActions()
  const date = useMemo(() => fromDateKey(activeDate), [activeDate])

  return useMemo(
    () => ({
      date,
      view,
      go: (direction: NavigationDirection) =>
        setActiveDate(toDateKey(shiftDate(date, view, direction))),
      goToToday: () => setActiveDate(toDateKey(new Date())),
    }),
    [date, view, setActiveDate],
  )
}
