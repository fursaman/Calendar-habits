import { AlertDialog } from 'radix-ui'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Button } from './Button'
import { modalContentClassName, overlayClassName } from './overlay'

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
}

/**
 * Asks before an irreversible action. Uses the alertdialog role and puts
 * initial focus on Cancel, so a stray Enter never confirms.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={overlayClassName} />
        <AlertDialog.Content className={cn(modalContentClassName, 'gap-2 p-5 sm:max-w-sm')}>
          <AlertDialog.Title className="text-title">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-body text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" className="sm:min-w-24">
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant={destructive ? 'destructive' : 'primary'}
                className="sm:min-w-24"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
