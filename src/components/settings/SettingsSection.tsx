import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type SettingsSectionProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/** A titled group of settings rows on a quiet inset surface. */
export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  const id = `settings-${title.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <section aria-labelledby={id} className={cn('space-y-2', className)}>
      <div className="px-1">
        <h3 id={id} className="text-label text-muted-foreground">
          {title}
        </h3>
        {description && <p className="text-caption text-faint-foreground">{description}</p>}
      </div>
      <div className="divide-y divide-border-subtle rounded-lg bg-surface-secondary dark:bg-surface-tertiary/50">
        {children}
      </div>
    </section>
  )
}

/** One row inside a SettingsSection: label on the left, control on the right. */
export function SettingsRow({
  label,
  htmlFor,
  children,
}: {
  label: ReactNode
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 px-4 py-2">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-body">
          {label}
        </label>
      ) : (
        <span className="text-body">{label}</span>
      )}
      {children}
    </div>
  )
}
