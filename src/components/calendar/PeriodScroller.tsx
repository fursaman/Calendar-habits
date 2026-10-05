import {
  addMonths,
  addWeeks,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { toDateKey } from '@/lib/calendar'
import { useAppActions } from '@/state'
import type { Weekday } from '@/types'

/** How long scrolling must pause before we treat it as settled. */
const SETTLE_MS = 120

type Unit = 'month' | 'week'

function periodMath(unit: Unit, weekStartsOn: Weekday) {
  return unit === 'month'
    ? {
        start: (date: Date) => startOfMonth(date),
        add: addMonths,
        diff: (a: Date, b: Date) => differenceInCalendarMonths(a, b),
      }
    : {
        start: (date: Date) => startOfWeek(date, { weekStartsOn }),
        add: addWeeks,
        diff: (a: Date, b: Date) => differenceInCalendarWeeks(a, b, { weekStartsOn }),
      }
}

export type PeriodScrollerProps = {
  date: Date
  unit: Unit
  weekStartsOn: Weekday
  /** Renders one period (a month or a week) from its first day. */
  renderPeriod: (start: Date) => ReactNode
}

/**
 * Scrolls vertically between periods and always snaps to one whole period.
 * It renders the previous, current, and next period; once a scroll settles on
 * a neighbor, that period becomes active and the window re-centers on it
 * without any visible jump. Step navigation (arrows, the habit panel) glides
 * the same way; far jumps (Today, the date picker) re-anchor instantly.
 */
export function PeriodScroller({ date, unit, weekStartsOn, renderPeriod }: PeriodScrollerProps) {
  const { setActiveDate } = useAppActions()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const math = periodMath(unit, weekStartsOn)
  const [anchor, setAnchor] = useState(() => math.start(date))
  if (Math.abs(math.diff(date, anchor)) > 1 || +math.start(anchor) !== +anchor) {
    setAnchor(math.start(date))
  }
  const periods = [math.add(anchor, -1), anchor, math.add(anchor, 1)]

  // Keep the anchor period in the middle slot whenever it changes.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTop = scroller.clientHeight
  }, [anchor])

  // Step navigation glides to the neighbor; the settle handler re-centers.
  useEffect(() => {
    const scroller = scrollerRef.current
    const offset = math.diff(date, anchor)
    if (!scroller || Math.abs(offset) !== 1) return
    scroller.scrollTo({ top: (1 + offset) * scroller.clientHeight, behavior: 'smooth' })
  })

  // When a scroll settles on a neighbor, make it the active period.
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let timer: number | undefined
    const settle = () => {
      const index = Math.round(scroller.scrollTop / scroller.clientHeight)
      const period = periods[index]
      if (index === 1 || !period) return
      const offset = math.diff(period, math.start(date))
      // Same day within the new period (clamped for short months).
      if (offset !== 0) setActiveDate(toDateKey(math.add(date, offset)))
      setAnchor(period)
    }
    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, SETTLE_MS)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      scroller.removeEventListener('scroll', onScroll)
    }
  })

  return (
    <div
      ref={scrollerRef}
      className="scrollbar-none h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
    >
      {periods.map((start) => (
        <section key={toDateKey(start)} className="h-full snap-start snap-always">
          {renderPeriod(start)}
        </section>
      ))}
    </div>
  )
}
