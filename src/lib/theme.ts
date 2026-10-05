import type { ResolvedTheme, ThemePreference } from '@/types'

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light'
  return preference
}

/** Applies the theme to <html>; tokens.css switches values off this attribute. */
export function applyTheme(theme: ResolvedTheme, root: HTMLElement = document.documentElement) {
  root.dataset.theme = theme
}
