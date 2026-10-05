import type { ReactNode } from 'react'

type AppShellProps = {
  title: string
  children: ReactNode
}

/** Mobile-first page frame: safe-area aware, content capped on wide screens. */
export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-content flex-col px-4 pt-[max(--spacing(4),env(safe-area-inset-top))] pb-[max(--spacing(4),env(safe-area-inset-bottom))]">
      <header className="flex h-touch items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      <main className="flex-1 pt-4">{children}</main>
    </div>
  )
}
