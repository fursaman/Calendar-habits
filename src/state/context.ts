import { createContext, type Dispatch } from 'react'

import type { AppAction, AppState } from './types'

/* State and dispatch live in separate contexts so components that only
 * dispatch don't re-render on every state change. */
export const AppStateContext = createContext<AppState | null>(null)
export const AppDispatchContext = createContext<Dispatch<AppAction> | null>(null)
