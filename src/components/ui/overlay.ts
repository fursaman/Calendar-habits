import { cn } from '@/lib/utils'

/** Shared overlay styles for modal backdrops. */
export const overlayClassName =
  'fixed inset-0 z-(--z-overlay) bg-overlay backdrop-blur-xs data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out'

/** Shared floating-surface styles for Popover and DropdownMenu. */
export const floatingSurfaceClassName =
  'z-(--z-dropdown) rounded-lg bg-surface text-foreground shadow-elevated data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out dark:bg-surface-secondary'

/**
 * Modal surface shared by every dialog in the app. On phones it rises from
 * the bottom edge like a native sheet; from `sm` up it is a centered card.
 */
export const modalContentClassName = cn(
  'fixed z-(--z-modal) flex flex-col bg-sheet text-foreground shadow-modal outline-none',
  'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-xl pb-[env(safe-area-inset-bottom)]',
  'data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out',
  'sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[85dvh] sm:w-[calc(100%-2rem)] sm:max-w-dialog sm:-translate-1/2 sm:rounded-xl sm:pb-0',
  'sm:data-[state=open]:animate-pop-in sm:data-[state=closed]:animate-pop-out',
)
