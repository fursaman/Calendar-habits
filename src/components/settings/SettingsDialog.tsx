import { HabitManager } from '@/components/habits/HabitManager'
import { PremiumCard } from '@/components/premium/PremiumCard'
import { Dialog, DialogContent } from '@/components/ui'
import { useAppActions, useAppState } from '@/state'

import { AppearanceSettings } from './AppearanceSettings'
import { CalendarSettings } from './CalendarSettings'
import { SettingsSection } from './SettingsSection'

export function SettingsDialog() {
  const { settingsOpen } = useAppState()
  const { setSettingsOpen } = useAppActions()

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent title="Settings" className="sm:max-w-lg">
        <div className="space-y-7 pt-1">
          <PremiumCard />
          <AppearanceSettings />
          <SettingsSection title="Habits">
            <HabitManager />
          </SettingsSection>
          <CalendarSettings />
        </div>
      </DialogContent>
    </Dialog>
  )
}
