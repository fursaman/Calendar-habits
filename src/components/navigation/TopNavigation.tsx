import { ChartNoAxesColumn, Settings } from 'lucide-react'

import { CalendarViewSwitcher } from '@/components/calendar/CalendarViewSwitcher'
import { HabitFilterBar } from '@/components/habits/HabitFilterBar'
import { IconButton } from '@/components/ui'
import { FILTERED_VIEWS, useToday } from '@/hooks'
import { fromDateKey, getPeriodKey } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState, useCalendarNavigation } from '@/state'

import { AppIcon } from './AppIcon'
import { DateNavigator } from './DateNavigator'
import { PeriodPicker } from './PeriodPicker'

/**
 * App toolbar. Desktop: one row with the brand, view switcher, period, and
 * navigation. Phones: the period and navigation on top, the view switcher
 * below. The habit filter sits underneath on every size.
 */
/** Contained toolbar buttons: Today, Analytics, Settings. */
const TOOLBAR_BUTTON = 'size-9 rounded-control'

export function TopNavigation() {
  const { settings } = useAppState()
  const { setSettingsOpen, setAnalyticsOpen } = useAppActions()
  const { date, view, go, goToToday } = useCalendarNavigation()
  const today = useToday()
  const { weekStartsOn } = settings.calendar
  const showFilter = FILTERED_VIEWS.includes(view)
  const showingToday =
    getPeriodKey(date, view, weekStartsOn) === getPeriodKey(fromDateKey(today), view, weekStartsOn)

  const actions = (
    <div className="flex items-center gap-1 pl-1 max-sm:pl-0.5">
      <IconButton
        icon={<ChartNoAxesColumn />}
        label="Analytics"
        tooltip
        variant="default"
        size="sm"
        className={TOOLBAR_BUTTON}
        onClick={() => setAnalyticsOpen(true)}
      />
      <IconButton
        icon={<Settings />}
        label="Settings"
        tooltip
        variant="default"
        size="sm"
        className={TOOLBAR_BUTTON}
        onClick={() => setSettingsOpen(true)}
      />
    </div>
  )

  const navigator = (
    <DateNavigator
      className="shrink-0"
      previousLabel={`Previous ${view}`}
      nextLabel={`Next ${view}`}
      onPrevious={() => go(-1)}
      onNext={() => go(1)}
      onToday={goToToday}
      isToday={showingToday}
      todayClassName={cn(TOOLBAR_BUTTON, 'w-auto px-3 max-sm:ml-0 max-sm:px-2.5')}
      tooltips
    />
  )

  return (
    <header className="sticky top-0 z-(--z-chrome) border-b border-border-subtle bg-chrome pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto max-w-content">
        {/* Desktop and tablet */}
        <div className="hidden h-17 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 lg:grid lg:px-6">
          <div className="flex items-center gap-2.5">
            <AppIcon />
            <span className="text-nav">Habits</span>
          </div>
          <CalendarViewSwitcher className="w-80" />
          <div className="flex min-w-0 items-center justify-end gap-1">
            <PeriodPicker className="mr-1 shrink-0" />
            {navigator}
            {actions}
          </div>
        </div>

        {/* Phones */}
        <div className="space-y-2 px-3 pt-2 pb-2 lg:hidden">
          <div className="flex h-13 items-center justify-between gap-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <AppIcon className="size-7" />
              <PeriodPicker compact className="-ml-1" />
            </div>
            <div className="flex items-center">
              {navigator}
              {actions}
            </div>
          </div>
          <CalendarViewSwitcher className="w-full sm:mx-auto sm:max-w-sm" />
        </div>

        {/* Week and Day show every habit, so the filter folds away there. */}
        <div
          inert={!showFilter}
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-emphasized ease-emphasized',
            showFilter ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <HabitFilterBar className="pb-2.5 lg:px-6" />
          </div>
        </div>
      </div>
    </header>
  )
}
