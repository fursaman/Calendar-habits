import { type PointerEvent, useMemo, useRef } from 'react'

/** Minimum horizontal travel (px) for a swipe. */
const SWIPE_DISTANCE = 56

/** Mark horizontally scrolling areas with this attribute so swipes inside them scroll instead. */
export const SWIPE_IGNORE_ATTRIBUTE = 'data-swipe-ignore'

/**
 * Horizontal swipe detection for touch input. Pair with `touch-pan-y` so the
 * browser keeps vertical scrolling and hands horizontal moves to us.
 */
export function useSwipe(onSwipe: (direction: -1 | 1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null)

  return useMemo(
    () => ({
      onPointerDown: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') return
        if (event.target instanceof Element && event.target.closest(`[${SWIPE_IGNORE_ATTRIBUTE}]`))
          return
        start.current = { x: event.clientX, y: event.clientY }
      },
      onPointerUp: (event: PointerEvent) => {
        const origin = start.current
        start.current = null
        if (!origin) return
        const dx = event.clientX - origin.x
        const dy = event.clientY - origin.y
        if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
          // Swiping left reveals what comes next.
          onSwipe(dx < 0 ? 1 : -1)
        }
      },
      onPointerCancel: () => {
        start.current = null
      },
    }),
    [onSwipe],
  )
}
