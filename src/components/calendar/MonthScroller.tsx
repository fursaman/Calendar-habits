import {
  addMonths,
  differenceInCalendarMonths,
  isSameMonth,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { toDateKey } from '@/lib/calendar'
import { useAppActions } from '@/state'

import { MonthCalendar } from './MonthCalendar'

/** How long scrolling must pause before we treat it as settled. */
const SETTLE_MS = 120

/**
 * Month view that scrolls vertically between months and always snaps to one
 * whole month. It renders the previous, current, and next month; once a
 * scroll settles on a neighbor, that month becomes active and the window
 * re-centers on it without any visible jump. Arrow and Today navigation
 * glide to adjacent months the same way.
 */
export function MonthScroller({ date }: { date: Date }) {
  const { setActiveDate } = useAppActions()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = useState(() => startOfMonth(date))
  // Far jumps (Today from another year, the date picker) re-anchor right away.
  if (Math.abs(differenceInCalendarMonths(date, anchor)) > 1) setAnchor(startOfMonth(date))
  const months = [addMonths(anchor, -1), anchor, addMonths(anchor, 1)]

  // Keep the anchor month in the middle slot whenever it changes.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollTop = scroller.clientHeight
  }, [anchor])

  // Step navigation from elsewhere (arrows, habit panel) glides to the
  // neighbor; the settle handler then re-centers on it.
  useEffect(() => {
    const scroller = scrollerRef.current
    const offset = differenceInCalendarMonths(date, anchor)
    if (!scroller || Math.abs(offset) !== 1) return
    scroller.scrollTo({ top: (1 + offset) * scroller.clientHeight, behavior: 'smooth' })
  }, [date, anchor])

  // When a scroll settles on a neighbor, make it the active month.
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let timer: number | undefined
    const settle = () => {
      const index = Math.round(scroller.scrollTop / scroller.clientHeight)
      const month = months[index]
      if (index === 1 || !month) return
      if (!isSameMonth(month, date)) {
        // Same day of month in the new month, clamped (Jan 31 -> Feb 28).
        setActiveDate(toDateKey(setMonth(setYear(date, month.getFullYear()), month.getMonth())))
      }
      setAnchor(month)
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
      {months.map((month) => (
        <section key={toDateKey(month)} className="h-full snap-start snap-always">
          <MonthCalendar date={month} />
        </section>
      ))}
    </div>
  )
}
