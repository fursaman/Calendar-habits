import { addDays } from 'date-fns'
import { Check, ChevronUp } from 'lucide-react'
import { useMemo } from 'react'

import { DateNavigator } from '@/components/navigation/DateNavigator'
import { Badge, BottomSheet } from '@/components/ui'
import { useToday } from '@/hooks'
import {
  formatFullDate,
  formatMonthDayShort,
  formatRelativeDay,
  formatShortDate,
  fromDateKey,
  toDateKey,
} from '@/lib/calendar'
import { getCompletedHabits, getDay } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'

import { HabitChecklist } from './HabitChecklist'
import { HabitDots } from './HabitIndicator'
import { HabitStats } from './HabitStats'

/**
 * The persistent habit tracker. Collapsed, it summarizes the active day;
 * expanded, it is the checklist for that day with day-by-day navigation.
 * It shares the active date with the calendar, so they never disagree.
 */
export function HabitPanel() {
  const { habits, completions, activeDate, panel } = useAppState()
  const { setPanel, setActiveDate } = useAppActions()
  const todayKey = useToday()

  const date = useMemo(() => fromDateKey(activeDate), [activeDate])
  const today = useMemo(() => fromDateKey(todayKey), [todayKey])
  const completed = getCompletedHabits(getDay(completions, activeDate), habits)
  const total = habits.length
  const allDone = total > 0 && completed.length === total
  const relative = formatRelativeDay(date, today, formatShortDate)
  /** "Today" / "Yesterday" / "Tomorrow", or empty for other days. */
  const nearby = formatRelativeDay(date, today, () => '')

  const summary = total === 0 ? 'No habits yet' : `${completed.length} of ${total} completed`

  return (
    <BottomSheet
      label="Habit tracker"
      snap={panel}
      onSnapChange={setPanel}
      peek={
        <span className="flex h-[calc(var(--spacing-sheet-peek)-0.625rem)] items-center gap-3 px-5">
          <span className="min-w-0 flex-1">
            <span className="block text-caption text-muted-foreground">Track your habits</span>
            <span className="flex items-center gap-1.5 truncate text-title">
              <span>{relative}</span>
              <span aria-hidden="true" className="text-faint-foreground">
                ·
              </span>
              <span
                className={cn(
                  'font-medium tabular-nums transition-colors duration-standard',
                  allDone ? 'text-success' : 'text-muted-foreground',
                )}
              >
                {summary}
              </span>
              {allDone && (
                <Badge variant="success" className="animate-pop-in">
                  <Check strokeWidth={3} aria-hidden="true" />
                  Done
                </Badge>
              )}
            </span>
          </span>
          <HabitDots habits={completed} />
          <ChevronUp
            aria-hidden="true"
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform duration-emphasized ease-emphasized',
              panel !== 'collapsed' && 'rotate-180',
            )}
          />
        </span>
      }
      more={<HabitStats date={activeDate} />}
    >
      <div className="px-3 pb-4">
        <DateNavigator
          className="px-1 py-2"
          label={
            <span className="block truncate text-nav" aria-live="polite">
              <span className="sr-only">{formatFullDate(date)}</span>
              <span aria-hidden="true">
                {nearby ? `${nearby}, ${formatMonthDayShort(date)}` : formatShortDate(date)}
              </span>
            </span>
          }
          previousLabel="Previous day"
          nextLabel="Next day"
          onPrevious={() => setActiveDate(toDateKey(addDays(date, -1)))}
          onNext={() => setActiveDate(toDateKey(addDays(date, 1)))}
          onToday={() => setActiveDate(todayKey)}
          isToday={activeDate === todayKey}
        />
        <HabitChecklist date={activeDate} />
      </div>
    </BottomSheet>
  )
}
