import { SegmentedControl, type SegmentedOption, Toggle } from '@/components/ui'
import { useTheme } from '@/hooks'
import { useAppActions, useAppState } from '@/state'
import type { ThemePreference } from '@/types'

import { SettingsRow, SettingsSection } from './SettingsSection'

const THEME_OPTIONS: readonly SegmentedOption<ThemePreference>[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function AppearanceSettings() {
  const { preference, setPreference } = useTheme()
  const { settings } = useAppState()
  const { updateSettings } = useAppActions()
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
      <SettingsRow label="Completion sound" htmlFor="completion-sound">
        <Toggle
          id="completion-sound"
          checked={settings.sounds}
          onCheckedChange={(sounds) => updateSettings({ sounds })}
        />
      </SettingsRow>
    </SettingsSection>
  )
}
