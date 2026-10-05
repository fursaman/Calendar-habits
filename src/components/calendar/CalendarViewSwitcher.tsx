import { SegmentedControl, type SegmentedOption } from '@/components/ui'
import { useAppActions, useAppState } from '@/state'
import type { CalendarView } from '@/types'

const VIEW_OPTIONS: readonly SegmentedOption<CalendarView>[] = [
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'week', label: 'Week' },
  { value: 'day', label: 'Day' },
]

export function CalendarViewSwitcher({ className }: { className?: string }) {
  const { view } = useAppState()
  const { setView } = useAppActions()
  return (
    <SegmentedControl
      label="Calendar view"
      value={view}
      onValueChange={(next) => setView(next)}
      options={VIEW_OPTIONS}
      className={className}
    />
  )
}
