import { Select, type SelectOption } from '@/components/ui'
import { useAppActions, useAppState } from '@/state'

import { SettingsRow, SettingsSection } from './SettingsSection'

type WeekStart = 'sunday' | 'monday'

const WEEK_START_OPTIONS: readonly SelectOption<WeekStart>[] = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
]

export function CalendarSettings() {
  const { settings } = useAppState()
  const { updateSettings } = useAppActions()
  const value: WeekStart = settings.calendar.weekStartsOn === 0 ? 'sunday' : 'monday'

  return (
    <SettingsSection title="Calendar">
      <SettingsRow label="First day of week" htmlFor="week-start">
        <Select
          id="week-start"
          value={value}
          options={WEEK_START_OPTIONS}
          onValueChange={(next) =>
            updateSettings({
              calendar: { ...settings.calendar, weekStartsOn: next === 'sunday' ? 0 : 1 },
            })
          }
          className="w-36"
        />
      </SettingsRow>
    </SettingsSection>
  )
}
