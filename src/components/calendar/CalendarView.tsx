import { useState } from 'react'

import { useSwipe } from '@/hooks'
import { getPeriodKey } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import { useAppState, useCalendarNavigation } from '@/state'
import type { CalendarView as View } from '@/types'

import { DayCalendar } from './DayCalendar'
import { MonthCalendar } from './MonthCalendar'
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
      previous.view !== view ? 'switch' : date.getTime() > previous.time ? 'next' : 'prev',
    )
    setPrevious({ view, periodKey, time: date.getTime() })
  }

  return (
    <div {...swipe} className={cn('touch-pan-y overflow-x-clip', className)}>
      <div key={`${view}:${periodKey}`} className={cn('h-full', TRANSITION_CLASS[transition])}>
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
      return <MonthCalendar date={date} />
    case 'week':
      return <WeekCalendar date={date} />
    case 'day':
      return <DayCalendar date={date} />
  }
}
