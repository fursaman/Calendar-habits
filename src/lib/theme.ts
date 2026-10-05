import type { ResolvedTheme, ThemePreference } from '@/types'

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

const TRANSITION_CLASS = 'theme-transition'
const TRANSITION_MS = 400

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light'
  return preference
}

let transitionTimer: number | undefined

/**
 * Applies the theme to <html>; tokens.css switches values off this attribute.
 * Changes after first paint cross-fade briefly, and the browser chrome color
 * follows the app background.
 */
export function applyTheme(theme: ResolvedTheme, root: HTMLElement = document.documentElement) {
  if (root.dataset.theme === theme) return

  const animate = root.dataset.theme !== undefined
  if (animate) {
    root.classList.add(TRANSITION_CLASS)
    window.clearTimeout(transitionTimer)
    transitionTimer = window.setTimeout(
      () => root.classList.remove(TRANSITION_CLASS),
      TRANSITION_MS,
    )
  }
  root.dataset.theme = theme

  const background = getComputedStyle(root).getPropertyValue('--color-background').trim()
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', background)
    meta.removeAttribute('media')
  })
}
