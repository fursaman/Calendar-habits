import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { overlayClassName } from './overlay'

export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerClose = DialogPrimitive.Close

export type DrawerContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  title: ReactNode
  description?: ReactNode
  hideTitle?: boolean
}

/**
 * Modal panel anchored to the bottom edge at every breakpoint. Use it for
 * short, focused tasks; use BottomSheet for the persistent, non-modal panel.
 */
export function DrawerContent({
  title,
  description,
  hideTitle = false,
  className,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-(--z-modal) mx-auto flex max-h-[90dvh] w-full max-w-sheet flex-col',
          'rounded-t-xl bg-surface text-foreground shadow-modal dark:bg-surface-secondary',
          'pb-[max(--spacing(4),env(safe-area-inset-bottom))]',
          'data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in',
          className,
        )}
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...props}
      >
        <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 rounded-pill bg-border" />
        <header className="px-5 pt-3 pb-3">
          <DialogPrimitive.Title className={cn('text-title', hideTitle && 'sr-only')}>
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-1 text-body text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
