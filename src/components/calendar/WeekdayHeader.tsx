import { useWeekdayHeaders } from '@/hooks'
import { formatWeekday } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import type { Weekday } from '@/types'

/** Weekday labels: narrow on phones, short from `sm` up. */
export function WeekdayHeader({
  weekStartsOn,
  className,
}: {
  weekStartsOn: Weekday
  className?: string
}) {
  const days = useWeekdayHeaders(weekStartsOn)
  return (
    <div role="row" className={cn('grid grid-cols-7', className)}>
      {days.map((day) => (
        <div
          key={day.getDay()}
          role="columnheader"
          aria-label={formatWeekday(day, 'long')}
          className="py-2 text-center text-weekday text-muted-foreground uppercase"
        >
          <span aria-hidden="true" className="sm:hidden">
            {formatWeekday(day, 'narrow')}
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            {formatWeekday(day, 'short')}
          </span>
        </div>
      ))}
    </div>
  )
}
