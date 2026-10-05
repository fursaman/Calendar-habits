import { use, useMemo } from 'react'

import { fromDateKey, type NavigationDirection, shiftDate, toDateKey } from '@/lib/calendar'
import { createHabit } from '@/lib/habits'

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
      setActiveDate: (date: Payload<'calendar/setActiveDate'>['date']) =>
        dispatch({ type: 'calendar/setActiveDate', date }),
      setView: (view: Payload<'calendar/setView'>['view']) =>
        dispatch({ type: 'calendar/setView', view }),
      setHabitFilter: (filter: Payload<'calendar/setHabitFilter'>['filter']) =>
        dispatch({ type: 'calendar/setHabitFilter', filter }),

      addHabit: (input: Parameters<typeof createHabit>[0]) =>
        dispatch({ type: 'habits/add', habit: createHabit(input) }),
      updateHabit: (payload: Payload<'habits/update'>) =>
        dispatch({ type: 'habits/update', ...payload }),
      removeHabit: (habitId: Payload<'habits/remove'>['habitId']) =>
        dispatch({ type: 'habits/remove', habitId }),

      toggleCompletion: (payload: Payload<'completions/toggle'>) =>
        dispatch({ type: 'completions/toggle', ...payload }),
      setCompletion: (payload: Payload<'completions/set'>) =>
        dispatch({ type: 'completions/set', ...payload }),

      updateSettings: (changes: Payload<'settings/update'>['changes']) =>
        dispatch({ type: 'settings/update', changes }),

      openSheet: (sheet: Payload<'sheet/open'>['sheet']) => dispatch({ type: 'sheet/open', sheet }),
      closeSheet: () => dispatch({ type: 'sheet/close' }),
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
      goToDate: (target: Date) => setActiveDate(toDateKey(target)),
    }),
    [date, view, setActiveDate],
  )
}
