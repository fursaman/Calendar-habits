import { addMonths } from 'date-fns'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { MiniMonth } from '@/components/calendar/MiniMonth'
import { IconButton, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { useToday } from '@/hooks'
import { formatMonthYear, formatPeriod } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState, useCalendarNavigation } from '@/state'

/**
 * The current period as a title. Clicking it opens a month picker for
 * jumping to any date without stepping through periods.
 */
export function PeriodPicker({
  className,
  compact = false,
}: {
  className?: string
  /** Shorter title for narrow toolbars. */
  compact?: boolean
}) {
  const { activeDate, settings } = useAppState()
  const { setActiveDate } = useAppActions()
  const { date, view } = useCalendarNavigation()
  const today = useToday()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(date)
  const { weekStartsOn } = settings.calendar

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setMonth(date)
        setOpen(next)
      }}
    >
      <PopoverTrigger
        className={cn(
          'flex min-w-0 items-center gap-1 rounded-md px-2 py-1 text-left transition-colors duration-fast hover:bg-muted',
          className,
        )}
        aria-label={`${formatPeriod(date, view, weekStartsOn)}, choose a date`}
      >
        <span className="truncate text-nav tabular-nums">
          {formatPeriod(date, view, weekStartsOn, undefined, compact)}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-standard',
            open && 'rotate-180',
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="mb-2 flex items-center justify-between">
          <span className="px-1 text-title" aria-live="polite">
            {formatMonthYear(month)}
          </span>
          <div className="flex">
            <IconButton
              icon={<ChevronLeft />}
              label="Previous month"
              size="sm"
              onClick={() => setMonth((current) => addMonths(current, -1))}
            />
            <IconButton
              icon={<ChevronRight />}
              label="Next month"
              size="sm"
              onClick={() => setMonth((current) => addMonths(current, 1))}
            />
          </div>
        </div>
        <MiniMonth
          month={month}
          weekStartsOn={weekStartsOn}
          today={today}
          selected={activeDate}
          showTitle={false}
          onSelectDate={(key) => {
            setActiveDate(key)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
