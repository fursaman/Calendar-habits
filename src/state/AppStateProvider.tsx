import { type ReactNode, useEffect, useReducer, useRef } from 'react'

import type { AppData, AppRepository } from '@/lib/storage'

import { AppDispatchContext, AppStateContext } from './context'
import { appReducer, createInitialState } from './reducer'

type AppStateProviderProps = {
  initialData: AppData
  repository: AppRepository
  children: ReactNode
}

/** Calls `save` whenever `value` changes, skipping the initial value. */
function usePersist<T>(value: T, save: (value: T) => Promise<void>) {
  const previous = useRef(value)
  useEffect(() => {
    if (previous.current === value) return
    previous.current = value
    void save(value)
  }, [value, save])
}

export function AppStateProvider({ initialData, repository, children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialData, (data) => createInitialState(data))

  usePersist(state.habits, repository.saveHabits)
  usePersist(state.completions, repository.saveCompletions)
  usePersist(state.settings, repository.saveSettings)
  usePersist(state.premium, repository.savePremium)

  return (
    <AppStateContext value={state}>
      <AppDispatchContext value={dispatch}>{children}</AppDispatchContext>
    </AppStateContext>
  )
}
