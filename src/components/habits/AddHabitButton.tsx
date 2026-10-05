import { Plus } from 'lucide-react'
import { useState } from 'react'

import { pickNextColor } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'
import { HABIT_COLORS } from '@/types'

import { HabitEditorDialog } from './HabitEditorDialog'

/**
 * "+ Add new" row that opens the new-habit form in place, so a habit can be
 * added straight from a checklist without going through Settings.
 */
export function AddHabitButton({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { habits } = useAppState()
  const { addHabit } = useAppActions()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 text-left text-body font-medium text-muted-foreground',
          'transition-colors duration-fast hover:bg-muted hover:text-foreground',
          size === 'lg' ? 'min-h-16' : 'min-h-14',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-md border border-dashed border-border',
            size === 'lg' ? 'size-10 rounded-lg [&_svg]:size-5' : 'size-8 [&_svg]:size-4.5',
          )}
        >
          <Plus />
        </span>
        Add new
      </button>
      <HabitEditorDialog
        open={open}
        onOpenChange={setOpen}
        defaultColor={pickNextColor(
          habits.map((habit) => habit.color),
          HABIT_COLORS,
        )}
        takenNames={habits.map((habit) => habit.name)}
        onSave={addHabit}
      />
    </>
  )
}
