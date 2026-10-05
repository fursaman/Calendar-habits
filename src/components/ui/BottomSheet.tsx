import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { overlayClassName } from './overlay'

export const BottomSheet = DialogPrimitive.Root
export const BottomSheetTrigger = DialogPrimitive.Trigger
export const BottomSheetClose = DialogPrimitive.Close

export type BottomSheetContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  title: ReactNode
  description?: ReactNode
  hideTitle?: boolean
}

/**
 * Mobile-first modal panel anchored to the bottom of the viewport.
 * Built on Dialog, so it traps focus, closes on Escape/overlay tap, and
 * restores focus on close. On wider screens it stays centered and capped.
 */
export function BottomSheetContent({
  title,
  description,
  hideTitle = false,
  className,
  children,
  ...props
}: BottomSheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-(--z-modal) mx-auto flex max-h-[90dvh] w-full max-w-content flex-col',
          'rounded-t-2xl border border-b-0 border-border bg-surface text-foreground shadow-lg',
          'pb-[max(--spacing(4),env(safe-area-inset-bottom))]',
          'data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in',
          className,
        )}
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...props}
      >
        <div aria-hidden="true" className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-border" />
        <header className="px-5 pt-2 pb-3">
          <DialogPrimitive.Title className={cn('text-lg font-semibold', hideTitle && 'sr-only')}>
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
