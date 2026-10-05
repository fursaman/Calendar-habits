import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './button-variants'
import { Tooltip } from './Tooltip'

const iconButtonVariants = cva(
  // The ::after extends the hit area to the 44px touch minimum without changing layout.
  'px-0 after:absolute after:-inset-1 after:content-[""]',
  {
    variants: {
      variant: {
        default: 'bg-surface-tertiary text-foreground hover:bg-border-subtle',
        ghost: 'text-foreground hover:bg-muted',
        subtle: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
      size: {
        sm: 'size-control-sm rounded-pill [&_svg]:size-4',
        md: 'size-control-md rounded-pill [&_svg]:size-5',
        lg: 'size-control-lg rounded-pill [&_svg]:size-6',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
)

export type IconButtonProps = Omit<ComponentProps<'button'>, 'children' | 'aria-label'> &
  VariantProps<typeof iconButtonVariants> & {
    icon: ReactNode
    /** Required accessible name, since the button has no visible text. */
    label: string
    /** Show the label as a hover/focus tooltip. */
    tooltip?: boolean
  }

export function IconButton({
  icon,
  label,
  variant,
  size,
  tooltip = false,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  const button = (
    <button
      type={type}
      aria-label={label}
      className={cn(
        buttonVariants({ variant: null, size: null }),
        iconButtonVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="contents">
        {icon}
      </span>
    </button>
  )
  return tooltip ? <Tooltip content={label}>{button}</Tooltip> : button
}
