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
        'h-control-lg w-full rounded-md bg-surface-tertiary px-3.5 text-input text-foreground',
        'border border-transparent transition-[border-color,box-shadow] duration-fast',
        'placeholder:text-faint-foreground',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-none',
        'aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    />
  )
}
