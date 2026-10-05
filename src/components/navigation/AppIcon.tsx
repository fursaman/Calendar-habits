import { CalendarCheck2 } from 'lucide-react'

import { cn } from '@/lib/utils'

/** The app mark: a calendar check on a graphite tile (matches the favicon). */
export function AppIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-foreground text-background shadow-subtle [&_svg]:size-5',
        className,
      )}
    >
      <CalendarCheck2 strokeWidth={2} />
    </span>
  )
}
