import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex h-5 shrink-0 items-center gap-1 rounded-pill px-2 text-caption font-medium whitespace-nowrap tabular-nums [&_svg]:size-3',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-tertiary text-muted-foreground',
        success: 'bg-success/15 text-success',
        today: 'bg-today/12 text-today',
        outline: 'border border-border text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
