import { cva, type VariantProps } from 'class-variance-authority'
import { Check } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import type { ComponentProps, CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const checkboxVariants = cva(
  [
    'peer relative inline-flex shrink-0 items-center justify-center rounded-pill border-2 border-border',
    'transition-[background-color,border-color,transform] duration-standard ease-emphasized',
    'active:scale-90 disabled:cursor-not-allowed disabled:opacity-40',
    'data-[state=checked]:border-(--checkbox-accent) data-[state=checked]:bg-(--checkbox-accent) data-[state=checked]:text-on-habit',
    // Extend the hit area for touch without changing layout.
    'after:absolute after:-inset-2 after:content-[""]',
  ],
  {
    variants: {
      size: {
        sm: 'size-5 [&_svg]:size-3',
        md: 'size-6 [&_svg]:size-3.5',
        lg: 'size-7 [&_svg]:size-4',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {
    /** CSS color for the checked state, e.g. a habit token. Defaults to primary. */
    accentColor?: string
  }

/** Round checkbox in the style of native task lists. */
export function Checkbox({ className, size, accentColor, style, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ size }), className)}
      style={
        {
          '--checkbox-accent': accentColor ?? 'var(--color-primary)',
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex animate-check items-center justify-center">
        <Check strokeWidth={3.5} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
