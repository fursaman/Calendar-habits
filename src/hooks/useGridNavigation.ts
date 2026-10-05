import { type KeyboardEvent, useCallback } from 'react'

const COLUMNS = 7

/**
 * Arrow-key movement between `[data-grid-cell]` buttons in a 7-column grid.
 * Only the selected cell is in the tab order; arrows move focus, and
 * Enter/Space activate the focused cell.
 */
export function useGridNavigation() {
  return useCallback((event: KeyboardEvent<HTMLElement>) => {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -COLUMNS,
      ArrowDown: COLUMNS,
    }
    const cells = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-grid-cell]:not([disabled])'),
    )
    const index = cells.indexOf(document.activeElement as HTMLElement)
    if (index === -1) return

    let next: number | undefined
    if (event.key in offsets) next = index + offsets[event.key]!
    else if (event.key === 'Home') next = index - (index % COLUMNS)
    else if (event.key === 'End') next = index - (index % COLUMNS) + COLUMNS - 1
    if (next === undefined) return

    event.preventDefault()
    cells[Math.min(Math.max(next, 0), cells.length - 1)]?.focus()
  }, [])
}
