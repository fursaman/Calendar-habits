import { AppShell } from '@/components/navigation/AppShell'
import { ThemeSwitcher } from '@/components/settings/ThemeSwitcher'
import { TooltipProvider } from '@/components/ui'
import { useThemeSync } from '@/hooks'

export function App() {
  useThemeSync()

  return (
    <TooltipProvider>
      <AppShell title="Habit Calendar">
        <section aria-labelledby="foundation-heading" className="space-y-4">
          <h2 id="foundation-heading" className="text-xl font-semibold">
            Foundation ready
          </h2>
          <p className="text-sm text-muted-foreground">
            Design tokens, theming, UI primitives, state, and persistence are in place. Calendar
            features come next.
          </p>
          <ThemeSwitcher />
        </section>
      </AppShell>
    </TooltipProvider>
  )
}
