import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './button-variants'

const iconButtonSizes = cva('px-0', {
  variants: {
    size: {
      sm: 'size-control-sm',
      md: 'size-control-md',
      lg: 'size-control-lg',
    },
  },
  defaultVariants: { size: 'md' },
})

export type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> &
  Pick<VariantProps<typeof buttonVariants>, 'variant'> &
  VariantProps<typeof iconButtonSizes> & {
    icon: ReactNode
    /** Required accessible name, since the button has no visible text. */
    label: string
  }

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(buttonVariants({ variant, size }), iconButtonSizes({ size }), className)}
      {...props}
    >
      <span aria-hidden="true" className="contents">
        {icon}
      </span>
    </button>
  )
}
