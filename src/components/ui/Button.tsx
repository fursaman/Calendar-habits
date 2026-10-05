import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './button-variants'

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a link) with button styles. */
    asChild?: boolean
  }

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : 'button'
  return (
    <Component
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  )
}
