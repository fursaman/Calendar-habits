import { AnalyticsDialog } from '@/components/analytics/AnalyticsDialog'
import { CalendarView } from '@/components/calendar/CalendarView'
import { HabitPanel } from '@/components/habits/HabitPanel'
import { StreakGradient } from '@/components/habits/StreakBadge'
import { StreakPopup } from '@/components/habits/StreakPopup'
import { TopNavigation } from '@/components/navigation/TopNavigation'
import { PaywallDialog } from '@/components/premium/PaywallDialog'
import { SettingsDialog } from '@/components/settings/SettingsDialog'
import { TooltipProvider } from '@/components/ui'
import { useThemeSync } from '@/hooks'

export function App() {
  useThemeSync()

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <TopNavigation />
        <main className="mx-auto flex min-h-0 w-full max-w-content flex-1 flex-col md:px-2 lg:px-4">
          {/* Bottom padding keeps content clear of the collapsed habit panel. */}
          <CalendarView className="min-h-0 flex-1 overflow-y-auto pb-[calc(var(--spacing-sheet-peek)+env(safe-area-inset-bottom)+--spacing(2))] sm:pb-[calc(var(--spacing-sheet-peek)+--spacing(5))]" />
        </main>
        <HabitPanel />
        <SettingsDialog />
        <AnalyticsDialog />
        <PaywallDialog />
        <StreakGradient />
        <StreakPopup />
      </div>
    </TooltipProvider>
  )
}
