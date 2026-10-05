import { useEffect } from 'react'

import { applyTheme, DARK_SCHEME_QUERY, resolveTheme } from '@/lib/theme'
import { useAppActions, useAppState } from '@/state'
import type { ResolvedTheme, ThemePreference } from '@/types'

import { useMediaQuery } from './useMediaQuery'

export function useTheme(): {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (theme: ThemePreference) => void
} {
  const { settings } = useAppState()
  const { updateSettings } = useAppActions()
  const systemPrefersDark = useMediaQuery(DARK_SCHEME_QUERY)

  return {
    preference: settings.theme,
    resolved: resolveTheme(settings.theme, systemPrefersDark),
    setPreference: (theme) => updateSettings({ theme }),
  }
}

/** Keeps the <html data-theme> attribute in sync. Mount once near the root. */
export function useThemeSync() {
  const { resolved } = useTheme()
  useEffect(() => applyTheme(resolved), [resolved])
}
