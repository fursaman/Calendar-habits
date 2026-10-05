import { cn } from '@/lib/utils'

/** The app mark (same file as the favicon). */
export function AppIcon({ className }: { className?: string }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('size-9 shrink-0 select-none', className)}
    />
  )
}
