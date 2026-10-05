import { SegmentedControl, type SegmentedOption } from '@/components/ui'
import { useTheme } from '@/hooks'
import type { ThemePreference } from '@/types'

const THEME_OPTIONS: readonly SegmentedOption<ThemePreference>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme()
  return (
    <SegmentedControl
      label="Theme"
      value={preference}
      onValueChange={setPreference}
      options={THEME_OPTIONS}
    />
  )
}
