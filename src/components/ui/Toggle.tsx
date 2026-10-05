import { Switch } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** On/off switch (role="switch"). Pair with a <Label> or pass aria-label. */
export function Toggle({ className, ...props }: ComponentProps<typeof Switch.Root>) {
  return (
    <Switch.Root
      className={cn(
        'inline-flex h-7 w-12 shrink-0 items-center rounded-pill p-0.5',
        'bg-surface-tertiary transition-colors duration-standard data-[state=checked]:bg-success',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <Switch.Thumb className="block size-6 rounded-pill bg-surface shadow-floating transition-transform duration-standard ease-emphasized data-[state=checked]:translate-x-5" />
    </Switch.Root>
  )
}
