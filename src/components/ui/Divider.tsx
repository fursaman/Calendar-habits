import { Separator } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Decorative by default (hidden from screen readers); pass `decorative={false}` for semantic separation. */
export function Divider({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: ComponentProps<typeof Separator.Root>) {
  return (
    <Separator.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'shrink-0 bg-border-subtle',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
}
