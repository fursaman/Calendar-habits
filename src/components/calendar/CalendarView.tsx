import { useCallback, useState } from 'react'

import { useSwipe } from '@/hooks'
import { getPeriodKey } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState, useCalendarNavigation } from '@/state'
import type { CalendarView as View, Weekday } from '@/types'
import { CALENDAR_VIEWS } from '@/types'

import { DayCalendar } from './DayCalendar'
import { MonthCalendar } from './MonthCalendar'
import { PeriodScroller } from './PeriodScroller'
import { WeekCalendar } from './WeekCalendar'
import { YearCalendar } from './YearCalendar'

const SCROLLING_VIEWS: readonly View[] = ['month', 'week']

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
 * Swiping horizontally on touch screens switches views: left goes to the more
 * detailed view (Year, Month, Week, Day), right goes back.
 */
export function CalendarView({ className }: { className?: string }) {
  const { settings } = useAppState()
  const { date, view } = useCalendarNavigation()
  const { setView } = useAppActions()
  const swipe = useSwipe(
    useCallback(
      (direction: -1 | 1) => {
        const next = CALENDAR_VIEWS[CALENDAR_VIEWS.indexOf(view) + direction]
        if (next) setView(next)
      },
      [view, setView],
    ),
  )
  const periodKey = getPeriodKey(date, view, settings.calendar.weekStartsOn)

  // Derive the transition from the previous render ("adjusting state on prop change").
  const [previous, setPrevious] = useState({ view, periodKey, time: date.getTime() })
  const [transition, setTransition] = useState<Transition>('none')
  if (previous.view !== view || previous.periodKey !== periodKey) {
    setTransition(
      previous.view !== view
        ? 'switch'
        : // Month and Week views move by scrolling, so they need no slide of their own.
          SCROLLING_VIEWS.includes(view)
          ? 'none'
          : date.getTime() > previous.time
            ? 'next'
            : 'prev',
    )
    setPrevious({ view, periodKey, time: date.getTime() })
  }

  return (
    <div {...swipe} className={cn('touch-pan-y overflow-x-hidden', className)}>
      {/* Scrolling views stay mounted across periods so their scroll position survives. */}
      <div
        key={SCROLLING_VIEWS.includes(view) ? view : `${view}:${periodKey}`}
        className={cn('h-full', TRANSITION_CLASS[transition])}
      >
        {renderView(view, date, settings.calendar.weekStartsOn)}
      </div>
    </div>
  )
}

function renderView(view: View, date: Date, weekStartsOn: Weekday) {
  switch (view) {
    case 'year':
      return <YearCalendar date={date} />
    case 'month':
    case 'week':
      return (
        <PeriodScroller
          date={date}
          unit={view}
          weekStartsOn={weekStartsOn}
          renderPeriod={(start) =>
            view === 'month' ? <MonthCalendar date={start} /> : <WeekCalendar date={start} />
          }
        />
      )
    case 'day':
      return <DayCalendar date={date} />
  }
}
