import { type ReactNode, useId } from 'react'

import { Checkbox } from '@/components/ui'
import { habitColorVar } from '@/lib/habits'
import { cn } from '@/lib/utils'
import type { Habit } from '@/types'

import { HabitGlyph } from './HabitGlyph'

export type HabitRowProps = {
  habit: Habit
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  /** Secondary line, e.g. a streak. */
  meta?: ReactNode
  size?: 'md' | 'lg'
}

/**
 * One habit with a large checkbox. The whole row is the hit target, and
 * completion is shown by the check mark, not by color alone.
 */
export function HabitRow({
  habit,
  checked,
  onCheckedChange,
  disabled = false,
  meta,
  size = 'md',
}: HabitRowProps) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-lg px-3 transition-colors duration-fast select-none',
        'hover:bg-muted has-[:focus-visible]:bg-muted',
        size === 'lg' ? 'min-h-16' : 'min-h-14',
        disabled && 'cursor-default hover:bg-transparent',
      )}
    >
      <HabitGlyph habit={habit} size={size === 'lg' ? 'lg' : 'md'} />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-body font-medium transition-colors duration-standard',
            checked ? 'text-foreground' : 'text-foreground/85',
          )}
        >
          {habit.name}
        </span>
        {meta && <span className="block text-caption text-muted-foreground">{meta}</span>}
      </span>
      <Checkbox
        id={id}
        size="lg"
        checked={checked}
        disabled={disabled}
        onCheckedChange={(state) => onCheckedChange(state === true)}
        accentColor={habitColorVar(habit.color)}
        className="focus-visible:outline-offset-4"
      />
    </label>
  )
}
