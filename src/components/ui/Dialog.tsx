import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { IconButton } from './IconButton'
import { modalContentClassName, overlayClassName } from './overlay'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Required: announced to screen readers when the dialog opens. */
  title: ReactNode
  description?: ReactNode
  /** Hide the title visually while keeping it accessible. */
  hideTitle?: boolean
  closeLabel?: string
  /** Sticky footer, e.g. Cancel / Save buttons. */
  footer?: ReactNode
}

export function DialogContent({
  title,
  description,
  hideTitle = false,
  closeLabel = 'Close',
  footer,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(modalContentClassName, className)}
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...props}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5 pb-3">
          <div className="min-w-0 space-y-1">
            <DialogPrimitive.Title className={cn('text-title', hideTitle && 'sr-only')}>
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-body text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close asChild>
            <IconButton icon={<X />} label={closeLabel} size="sm" variant="default" />
          </DialogPrimitive.Close>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
          {children}
        </div>
        {footer && (
          <footer className="flex shrink-0 justify-end gap-2 border-t border-border-subtle px-5 py-3">
            {footer}
          </footer>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
