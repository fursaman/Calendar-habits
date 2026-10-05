import { CalendarView } from '@/components/calendar/CalendarView'
import { HabitPanel } from '@/components/habits/HabitPanel'
import { TopNavigation } from '@/components/navigation/TopNavigation'
import { SettingsDialog } from '@/components/settings/SettingsDialog'
import { TooltipProvider } from '@/components/ui'
import { useThemeSync } from '@/hooks'

export function App() {
  useThemeSync()

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <TopNavigation />
        {/* Bottom padding keeps the last calendar row clear of the collapsed habit panel. */}
        <main className="mx-auto flex min-h-0 w-full max-w-content flex-1 flex-col overflow-y-auto pb-[calc(var(--spacing-sheet-peek)+env(safe-area-inset-bottom)+--spacing(2))] sm:pb-[calc(var(--spacing-sheet-peek)+--spacing(5))] md:px-2 lg:px-4">
          <CalendarView className="flex-1" />
        </main>
        <HabitPanel />
        <SettingsDialog />
      </div>
    </TooltipProvider>
  )
}
