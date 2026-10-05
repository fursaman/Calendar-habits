import { cva } from 'class-variance-authority'

/** Shared by Button and IconButton so both stay visually consistent. */
export const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap select-none',
    'transition-[background-color,color,opacity,transform] duration-fast',
    'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        secondary: 'bg-surface-tertiary text-foreground hover:bg-border-subtle',
        ghost: 'text-foreground hover:bg-muted',
        subtle: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        'destructive-ghost': 'text-destructive hover:bg-destructive/10',
      },
      size: {
        sm: 'h-control-sm rounded-md px-3 text-label [&_svg]:size-4',
        md: 'h-control-md rounded-md px-4 text-body font-medium [&_svg]:size-4.5',
        lg: 'h-control-lg rounded-lg px-5 text-title [&_svg]:size-5',
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
