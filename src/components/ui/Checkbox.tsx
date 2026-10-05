import { Check } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type { ComponentProps, CSSProperties } from 'react'

import { cn } from '@/lib/utils'

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  /** CSS color for the checked state, e.g. a habit token. Defaults to primary. */
  accentColor?: string
}

export function Checkbox({ className, accentColor, style, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-border',
        'transition-colors duration-fast',
        'data-[state=checked]:border-(--checkbox-accent) data-[state=checked]:bg-(--checkbox-accent) data-[state=checked]:text-primary-foreground',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      style={
        {
          '--checkbox-accent': accentColor ?? 'var(--color-primary)',
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator className="data-[state=checked]:animate-pop-in">
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
