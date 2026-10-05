import { cn } from '@/lib/utils'

/** The app mark: the gradient lightning favicon, crisp at any size. */
export function AppIcon({ className }: { className?: string }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('size-9 shrink-0 object-contain select-none', className)}
    />
  )
}
