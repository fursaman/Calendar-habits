import { cva } from 'class-variance-authority'

/** Shared by Button and IconButton so both stay visually consistent. */
export const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap select-none',
    'transition-colors duration-fast',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-[1.25em] [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'border border-border bg-surface-secondary text-foreground hover:bg-surface-tertiary',
        ghost: 'text-foreground hover:bg-muted active:bg-surface-tertiary',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80',
      },
      size: {
        sm: 'h-control-sm rounded-md px-3 text-sm',
        md: 'h-control-md rounded-lg px-4 text-sm',
        lg: 'h-control-lg rounded-xl px-5 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)
