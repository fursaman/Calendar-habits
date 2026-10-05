import { ToggleGroup } from 'radix-ui'

import { cn } from '@/lib/utils'

export type SegmentedOption<T extends string> = { value: T; label: string }

export type SegmentedControlProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  /** Accessible name for the group. */
  label: string
  className?: string
}

/** Single-choice pill switcher, e.g. Week / Month / Year. Arrow keys move between options. */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      // Radix emits '' when the active item is clicked again; keep a value selected.
      onValueChange={(next) => next && onValueChange(next as T)}
      aria-label={label}
      className={cn('inline-flex w-full rounded-lg bg-surface-tertiary p-1', className)}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'h-control-sm flex-1 rounded-md px-3 text-sm font-medium text-muted-foreground',
            'transition-colors duration-fast hover:text-foreground',
            'data-[state=on]:bg-surface data-[state=on]:text-foreground data-[state=on]:shadow-sm',
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
