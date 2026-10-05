import { ToggleGroup } from 'radix-ui'

import { cn } from '@/lib/utils'

export type SegmentedOption<T extends string> = { value: T; label: string }

export type SegmentedControlProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  /** Accessible name for the group. */
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Single-choice pill switcher, e.g. Year / Month / Week / Day. Arrow keys move
 * between options; the active pill slides between positions.
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  label,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      // Radix emits '' when the active item is clicked again; keep a value selected.
      onValueChange={(next) => next && onValueChange(next as T)}
      aria-label={label}
      className={cn(
        'relative isolate grid auto-cols-fr grid-flow-col rounded-md bg-surface-tertiary p-0.5 dark:bg-surface-secondary',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 -z-10 rounded-[calc(var(--radius-md)-2px)] bg-control-thumb shadow-floating transition-transform duration-emphasized ease-emphasized"
        style={{
          width: `calc((100% - 4px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'rounded-[calc(var(--radius-md)-2px)] px-3 text-label whitespace-nowrap text-muted-foreground',
            'transition-colors duration-fast hover:text-foreground data-[state=on]:text-foreground',
            size === 'sm' ? 'h-7' : 'h-8',
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
