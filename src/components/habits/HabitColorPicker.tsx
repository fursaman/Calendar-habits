import { Check } from 'lucide-react'
import { RadioGroup } from 'radix-ui'
import type { CSSProperties } from 'react'

import { habitColorVar } from '@/lib/habits'
import type { HabitColor } from '@/types'
import { HABIT_COLORS } from '@/types'

const COLOR_LABELS: Record<HabitColor, string> = {
  green: 'Green',
  orange: 'Orange',
  purple: 'Purple',
  blue: 'Blue',
  red: 'Red',
  pink: 'Pink',
  yellow: 'Yellow',
  teal: 'Teal',
  indigo: 'Indigo',
  graphite: 'Graphite',
}

export function HabitColorPicker({
  value,
  onValueChange,
  labelledBy,
}: {
  value: HabitColor
  onValueChange: (color: HabitColor) => void
  labelledBy: string
}) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onValueChange(next as HabitColor)}
      aria-labelledby={labelledBy}
      orientation="horizontal"
      // Swatches line up with the label's edges; the padding leaves room for the selection ring.
      className="-mx-1 grid grid-cols-[repeat(5,auto)] justify-between gap-y-3 p-1 sm:grid-cols-[repeat(10,auto)] sm:gap-y-2"
    >
      {HABIT_COLORS.map((color) => (
        <RadioGroup.Item
          key={color}
          value={color}
          aria-label={COLOR_LABELS[color]}
          style={{ '--habit': habitColorVar(color) } as CSSProperties}
          className="relative inline-flex size-9 items-center justify-center rounded-pill bg-(--habit) text-on-habit transition-transform duration-fast hover:scale-105 active:scale-95 data-[state=checked]:ring-2 data-[state=checked]:ring-(--habit) data-[state=checked]:ring-offset-2 data-[state=checked]:ring-offset-surface sm:size-8 dark:data-[state=checked]:ring-offset-surface-secondary"
        >
          <RadioGroup.Indicator className="animate-check">
            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
