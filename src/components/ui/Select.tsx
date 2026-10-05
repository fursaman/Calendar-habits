import { Check, ChevronsUpDown } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

export type SelectOption<T extends string> = { value: T; label: string; disabled?: boolean }

export type SelectProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: readonly SelectOption<T>[]
  placeholder?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  disabled?: boolean
  className?: string
}

export function Select<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  ...triggerProps
}: SelectProps<T>) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={(next) => onValueChange(next as T)}>
      <SelectPrimitive.Trigger
        className={cn(
          'inline-flex h-control-md items-center justify-between gap-2 rounded-md bg-surface-tertiary pr-2.5 pl-3 text-body font-medium text-foreground',
          'transition-colors duration-fast hover:bg-border-subtle',
          'disabled:opacity-40 data-placeholder:text-muted-foreground',
          className,
        )}
        {...triggerProps}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-(--z-dropdown) max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg bg-surface shadow-elevated data-[state=open]:animate-pop-in"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled ?? false}
                className="relative flex h-control-md cursor-default items-center rounded-sm pr-9 pl-3 text-body outline-none select-none data-disabled:opacity-40 data-highlighted:bg-muted"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3">
                  <Check className="size-4" aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
