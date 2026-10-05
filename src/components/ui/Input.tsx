import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type InputProps = ComponentProps<'input'> & {
  invalid?: boolean
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        // text-base (16px) prevents iOS Safari from zooming on focus.
        'h-control-lg w-full rounded-lg border border-border bg-surface px-3 text-base text-foreground',
        'transition-colors duration-fast placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none',
        'aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
