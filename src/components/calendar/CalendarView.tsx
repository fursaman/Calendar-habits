import { useState } from 'react'

import { useSwipe } from '@/hooks'
import { getPeriodKey } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import { useAppState, useCalendarNavigation } from '@/state'
import type { CalendarView as View } from '@/types'

import { DayCalendar } from './DayCalendar'
import { MonthScroller } from './MonthScroller'
import { WeekCalendar } from './WeekCalendar'
import { YearCalendar } from './YearCalendar'

type Transition = 'next' | 'prev' | 'switch' | 'none'

const TRANSITION_CLASS: Record<Transition, string> = {
  next: 'animate-view-next',
  prev: 'animate-view-prev',
  switch: 'animate-view-switch',
  none: '',
}

/**
 * Renders the active view and animates between periods: a short slide in the
 * direction of travel when the period changes, a soft fade when the view
 * changes, and nothing when selecting another day in the same period.
 * Swiping horizontally on touch screens moves between periods.
 */
export function CalendarView({ className }: { className?: string }) {
  const { settings } = useAppState()
  const { date, view, go } = useCalendarNavigation()
  const swipe = useSwipe(go)
  const periodKey = getPeriodKey(date, view, settings.calendar.weekStartsOn)

  // Derive the transition from the previous render ("adjusting state on prop change").
  const [previous, setPrevious] = useState({ view, periodKey, time: date.getTime() })
  const [transition, setTransition] = useState<Transition>('none')
  if (previous.view !== view || previous.periodKey !== periodKey) {
    setTransition(
      previous.view !== view
        ? 'switch'
        : // Month view moves by scrolling, so it needs no slide of its own.
          view === 'month'
          ? 'none'
          : date.getTime() > previous.time
            ? 'next'
            : 'prev',
    )
    setPrevious({ view, periodKey, time: date.getTime() })
  }

  return (
    <div {...swipe} className={cn('touch-pan-y overflow-x-hidden', className)}>
      {/* Month view stays mounted across months so its scroll position survives. */}
      <div
        key={view === 'month' ? view : `${view}:${periodKey}`}
        className={cn('h-full', TRANSITION_CLASS[transition])}
      >
        {renderView(view, date)}
      </div>
    </div>
  )
}

function renderView(view: View, date: Date) {
  switch (view) {
    case 'year':
      return <YearCalendar date={date} />
    case 'month':
      return <MonthScroller date={date} />
    case 'week':
      return <WeekCalendar date={date} />
    case 'day':
      return <DayCalendar date={date} />
  }
}
