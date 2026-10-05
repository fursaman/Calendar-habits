import { cn } from '@/lib/utils'

/**
 * The app mark, sized like the toolbar buttons. Dark tile in light theme,
 * light tile in dark theme (same files as the favicons).
 */
export function AppIcon({ className }: { className?: string }) {
  const classes = cn('size-9 shrink-0 select-none', className)
  return (
    <>
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className={cn(classes, 'dark:hidden')}
      />
      <img
        src="/favicon-dark.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className={cn(classes, 'hidden dark:block')}
      />
    </>
  )
}
