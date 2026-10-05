import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { IconButton } from './IconButton'
import { overlayClassName } from './overlay'

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
}

export function DialogContent({
  title,
  description,
  hideTitle = false,
  closeLabel = 'Close',
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-(--z-modal) w-[calc(100%-2rem)] max-w-md -translate-1/2',
          'rounded-2xl border border-border bg-surface p-6 text-foreground shadow-lg',
          'data-[state=closed]:animate-fade-out data-[state=open]:animate-pop-in',
          className,
        )}
        {...(description ? {} : { 'aria-describedby': undefined })}
        {...props}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <DialogPrimitive.Title className={cn('text-lg font-semibold', hideTitle && 'sr-only')}>
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close asChild>
            <IconButton icon={<X />} label={closeLabel} size="sm" className="-mt-1 -mr-2" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
