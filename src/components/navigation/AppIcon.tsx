import { cn } from '@/lib/utils'

/** The app mark: the same artwork as the favicon, crisp at any size. */
export function AppIcon({ className }: { className?: string }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('size-7 shrink-0 rounded-md shadow-subtle select-none', className)}
    />
  )
}
