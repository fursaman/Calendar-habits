import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'

export type SheetSnap = 'collapsed' | 'half' | 'full'

export type BottomSheetProps = {
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
  /** Accessible name for the sheet region. */
  label: string
  /**
   * Always-visible header row. It is rendered inside a button that toggles the
   * sheet, so it must not contain interactive elements.
   */
  peek: ReactNode
  /** Shown from the half snap up. */
  children: ReactNode
  /** Extra content revealed only at the full snap. */
  more?: ReactNode
  className?: string
}

type Metrics = { peek: number; half: number; full: number }

/** Pointer travel (px) before a press becomes a drag. */
const DRAG_THRESHOLD = 6
/** How far (ms) a fling's velocity projects the release position. */
const FLING_PROJECTION_MS = 160

/**
 * Non-modal, draggable sheet pinned to the bottom of the viewport, in the
 * spirit of iOS sheets. Three snaps: collapsed (peek row only), half, and
 * full. Tap the header to toggle, drag it to any snap, or press Escape to
 * collapse. Offscreen sections are `inert`, so keyboard and screen reader
 * users only reach what is visible.
 */
export function BottomSheet({
  snap,
  onSnapChange,
  label,
  peek,
  children,
  more,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLElement>(null)
  const peekRef = useRef<HTMLDivElement>(null)
  const halfRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [dragOffset, setDragOffset] = useState<number | null>(null)
  const suppressClick = useRef(false)

  // Measure the height of each snap whenever content or the viewport changes.
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    const peekEl = peekRef.current
    const halfEl = halfRef.current
    if (!sheet || !peekEl || !halfEl) return

    const measure = () => {
      const style = getComputedStyle(sheet)
      // The bottom padding is the iOS safe area; every snap includes it.
      const inset = parseFloat(style.paddingBottom) || 0
      const max = parseFloat(style.maxHeight) || Infinity
      const peekHeight = peekEl.offsetHeight + inset
      const half = Math.min(peekHeight + halfEl.offsetHeight, max)
      const full = Math.min(half + (moreRef.current?.offsetHeight ?? 0), max)
      setMetrics({ peek: peekHeight, half, full })
    }
    measure()
    const observer = new ResizeObserver(measure)
    for (const element of [peekEl, halfEl, moreRef.current]) if (element) observer.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const visibleFor = useCallback(
    (target: SheetSnap) => {
      if (!metrics) return 0
      return target === 'collapsed' ? metrics.peek : target === 'half' ? metrics.half : metrics.full
    },
    [metrics],
  )

  // Full only exists when it shows more than half.
  const hasFull = !!more && !!metrics && metrics.full - metrics.half > 24
  const effectiveSnap: SheetSnap = snap === 'full' && !hasFull ? 'half' : snap
  const height = dragOffset ?? visibleFor(effectiveSnap)

  function nearestSnap(position: number): SheetSnap {
    const snaps: SheetSnap[] = hasFull ? ['collapsed', 'half', 'full'] : ['collapsed', 'half']
    return snaps.reduce((best, candidate) =>
      Math.abs(visibleFor(candidate) - position) < Math.abs(visibleFor(best) - position)
        ? candidate
        : best,
    )
  }

  /**
   * Drags are tracked on the window, so fast swipes that leave the handle
   * still register, while taps keep their normal click on the header button.
   */
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!metrics || (event.pointerType === 'mouse' && event.button !== 0)) return
    const start = visibleFor(effectiveSnap)
    const state = {
      startY: event.clientY,
      current: start,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false,
    }
    const min = metrics.peek
    const max = hasFull ? metrics.full : metrics.half

    const onMove = (move: globalThis.PointerEvent) => {
      const delta = state.startY - move.clientY
      if (!state.moved && Math.abs(delta) < DRAG_THRESHOLD) return
      state.moved = true
      const elapsed = Math.max(1, move.timeStamp - state.lastTime)
      state.velocity = (state.lastY - move.clientY) / elapsed
      state.lastY = move.clientY
      state.lastTime = move.timeStamp

      // Rubber-band slightly past the ends instead of stopping dead.
      const raw = start + delta
      state.current =
        raw < min ? min - (min - raw) * 0.25 : raw > max ? max + (raw - max) * 0.25 : raw
      setDragOffset(state.current)
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      if (!state.moved) return
      // The click that follows a drag must not toggle the sheet.
      suppressClick.current = true
      window.setTimeout(() => (suppressClick.current = false), 0)
      setDragOffset(null)
      onSnapChange(nearestSnap(state.current + state.velocity * FLING_PROJECTION_MS))
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  function toggle() {
    if (suppressClick.current) return
    onSnapChange(effectiveSnap === 'collapsed' ? 'half' : 'collapsed')
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && effectiveSnap !== 'collapsed') {
      event.stopPropagation()
      onSnapChange('collapsed')
      peekRef.current?.querySelector('button')?.focus()
    }
  }

  const expanded = effectiveSnap !== 'collapsed'

  return (
    // Escape anywhere inside the sheet collapses it.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <section
      ref={sheetRef}
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'fixed inset-x-0 bottom-0 z-(--z-sheet) mx-auto flex max-h-[88dvh] w-full max-w-sheet flex-col overflow-hidden',
        'rounded-t-xl bg-surface/95 shadow-elevated backdrop-blur-xl backdrop-saturate-150 dark:bg-surface-secondary/95',
        'pb-[env(safe-area-inset-bottom)] sm:bottom-3 sm:w-[calc(100%-1.5rem)] sm:rounded-xl sm:pb-0',
        // Hidden until measured so it never flashes open on load.
        !metrics && 'invisible',
        dragOffset === null && 'transition-[height] duration-sheet ease-sheet',
        className,
      )}
      style={{ height: metrics ? height : undefined }}
    >
      <div ref={peekRef} className="shrink-0 touch-none" onPointerDown={onPointerDown}>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={toggle}
          className="block w-full rounded-t-xl text-left outline-offset-[-2px] select-none"
        >
          <span
            aria-hidden="true"
            className="mx-auto mt-1.5 block h-1 w-9 rounded-pill bg-border"
          />
          {peek}
        </button>
      </div>
      <div
        className={cn(
          'min-h-0 flex-1 overscroll-contain',
          effectiveSnap === 'full' ? 'overflow-y-auto' : 'overflow-hidden',
        )}
      >
        <div ref={halfRef} inert={!expanded}>
          {children}
        </div>
        {more && (
          <div ref={moreRef} inert={effectiveSnap !== 'full'}>
            {more}
          </div>
        )}
      </div>
    </section>
  )
}
