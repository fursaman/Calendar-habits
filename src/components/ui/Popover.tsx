import { Popover as PopoverPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { floatingSurfaceClassName } from './overlay'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverClose = PopoverPrimitive.Close

export function PopoverContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={16}
        className={cn(floatingSurfaceClassName, 'w-72 p-4', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
