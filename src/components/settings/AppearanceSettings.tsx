import { SegmentedControl, type SegmentedOption } from '@/components/ui'
import { useTheme } from '@/hooks'
import type { ThemePreference } from '@/types'

import { SettingsRow, SettingsSection } from './SettingsSection'

const THEME_OPTIONS: readonly SegmentedOption<ThemePreference>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function AppearanceSettings() {
  const { preference, setPreference } = useTheme()
  return (
    <SettingsSection title="Appearance">
      <SettingsRow label="Theme">
        <SegmentedControl
          label="Theme"
          value={preference}
          onValueChange={setPreference}
          options={THEME_OPTIONS}
          className="w-56"
        />
      </SettingsRow>
    </SettingsSection>
  )
}
