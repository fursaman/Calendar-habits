import { ToggleGroup } from 'radix-ui'
import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type ChoiceChip<T extends string> = {
  value: T
  label: string
  /** Leading visual, e.g. a color dot or icon. */
  leading?: ReactNode
  /** CSS color used to tint the chip when selected. */
  accentColor?: string
}

export type ChoiceChipsProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: readonly ChoiceChip<T>[]
  /** Accessible name for the group. */
  label: string
  className?: string
}

/**
 * Horizontally scrolling single-choice chips (filters). Scrolls with touch,
 * arrow keys move between chips, and the selected chip scrolls into view.
 */
export function ChoiceChips<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
}: ChoiceChipsProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => next && onValueChange(next as T)}
      aria-label={label}
      className={cn(
        'scrollbar-none flex snap-x scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain',
        className,
      )}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          onFocus={(event) =>
            event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' })
          }
          style={
            { '--chip-accent': option.accentColor ?? 'var(--color-foreground)' } as CSSProperties
          }
          className={cn(
            'flex h-control-sm shrink-0 snap-start items-center gap-1.5 rounded-pill border border-border-subtle px-3 text-label whitespace-nowrap text-muted-foreground',
            'transition-[background-color,border-color,color] duration-standard hover:text-foreground',
            'data-[state=on]:border-transparent data-[state=on]:bg-[color-mix(in_oklch,var(--chip-accent)_14%,transparent)] data-[state=on]:text-foreground',
          )}
        >
          {option.leading}
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
