import { DropdownMenu as MenuPrimitive } from 'radix-ui'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { floatingSurfaceClassName } from './overlay'

export const DropdownMenu = MenuPrimitive.Root
export const DropdownMenuTrigger = MenuPrimitive.Trigger
export const DropdownMenuGroup = MenuPrimitive.Group

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={16}
        className={cn(floatingSurfaceClassName, 'min-w-48 p-1', className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

export type DropdownMenuItemProps = ComponentProps<typeof MenuPrimitive.Item> & {
  variant?: 'default' | 'destructive'
}

export function DropdownMenuItem({
  className,
  variant = 'default',
  ...props
}: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cn(
        'flex h-control-md cursor-default items-center gap-2 rounded-md px-3 text-sm outline-none select-none',
        'data-disabled:opacity-50 data-highlighted:bg-muted [&_svg]:size-4',
        variant === 'destructive' && 'text-destructive',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator className={cn('my-1 h-px bg-border-subtle', className)} {...props} />
  )
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      className={cn('px-3 py-1.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}
