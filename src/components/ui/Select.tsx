import { Check, ChevronDown } from 'lucide-react'
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
          'inline-flex h-control-lg w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-base text-foreground',
          'disabled:opacity-50 data-placeholder:text-muted-foreground',
          className,
        )}
        {...triggerProps}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-(--z-dropdown) max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border bg-surface shadow-md data-[state=open]:animate-pop-in"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled ?? false}
                className="relative flex h-control-md cursor-default items-center rounded-md pr-8 pl-3 text-sm outline-none select-none data-disabled:opacity-50 data-highlighted:bg-muted"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2">
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
