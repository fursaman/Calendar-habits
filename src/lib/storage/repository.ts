import type { CompletionMap, Habit, UserSettings } from '@/types'

export type AppData = {
  habits: Habit[]
  completions: CompletionMap
  settings: UserSettings
}

/**
 * The only persistence API the app depends on. It is async so a backend
 * implementation can replace the local one without changing callers.
 */
export type AppRepository = {
  load(): Promise<AppData>
  saveHabits(habits: Habit[]): Promise<void>
  saveCompletions(completions: CompletionMap): Promise<void>
  saveSettings(settings: UserSettings): Promise<void>
}
