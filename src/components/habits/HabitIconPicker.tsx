import { RadioGroup } from 'radix-ui'
import type { CSSProperties } from 'react'

import { habitColorVar } from '@/lib/habits'
import type { HabitColor, HabitIcon } from '@/types'
import { HABIT_ICONS } from '@/types'

import { HABIT_ICON_COMPONENTS, HABIT_ICON_LABELS } from './habit-icons'

export function HabitIconPicker({
  value,
  color,
  onValueChange,
  labelledBy,
}: {
  value: HabitIcon | undefined
  color: HabitColor
  onValueChange: (icon: HabitIcon) => void
  labelledBy: string
}) {
  return (
    <RadioGroup.Root
      value={value ?? ''}
      onValueChange={(next) => onValueChange(next as HabitIcon)}
      aria-labelledby={labelledBy}
      className="grid grid-cols-7 gap-1 sm:grid-cols-10"
      style={{ '--habit': habitColorVar(color) } as CSSProperties}
    >
      {HABIT_ICONS.map((icon) => {
        const Icon = HABIT_ICON_COMPONENTS[icon]
        return (
          <RadioGroup.Item
            key={icon}
            value={icon}
            aria-label={HABIT_ICON_LABELS[icon]}
            className="inline-flex aspect-square items-center justify-center rounded-md text-muted-foreground transition-colors duration-fast hover:bg-muted hover:text-foreground data-[state=checked]:bg-[color-mix(in_oklch,var(--habit)_16%,transparent)] data-[state=checked]:text-(--habit)"
          >
            <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
          </RadioGroup.Item>
        )
      })}
    </RadioGroup.Root>
  )
}
