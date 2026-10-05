import { Tooltip as TooltipPrimitive } from 'radix-ui'
import type { ReactElement, ReactNode } from 'react'

const TOOLTIP_DELAY_MS = 400

/** Wrap the app once so tooltips share open/close timing. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={TOOLTIP_DELAY_MS}>
      {children}
    </TooltipPrimitive.Provider>
  )
}

export type TooltipProps = {
  content: ReactNode
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * Supplementary hint on hover/focus. Never put essential information here:
 * touch devices have no hover.
 */
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="z-(--z-tooltip) rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md data-[state=delayed-open]:animate-fade-in"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
