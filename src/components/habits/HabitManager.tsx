import { Ellipsis, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import {
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
} from '@/components/ui'
import { pickNextColor } from '@/lib/habits'
import { useAppActions, useAppState } from '@/state'
import type { Habit } from '@/types'
import { HABIT_COLORS } from '@/types'

import { HabitEditorDialog } from './HabitEditorDialog'
import { HabitGlyph } from './HabitGlyph'

type Editing = { mode: 'create' } | { mode: 'edit'; habit: Habit } | null

/** Add, edit, and delete habits. Deleting always asks for confirmation. */
export function HabitManager() {
  const { habits } = useAppState()
  const { addHabit, updateHabit, removeHabit } = useAppActions()
  const [editing, setEditing] = useState<Editing>(null)
  const [deleting, setDeleting] = useState<Habit | null>(null)

  const editingHabit = editing?.mode === 'edit' ? editing.habit : undefined
  const takenNames = habits.map((habit) => habit.name)

  return (
    <>
      <ul aria-label="Your habits" className="divide-y divide-border-subtle">
        {habits.map((habit) => (
          <li key={habit.id} className="flex min-h-14 items-center gap-3 pr-2 pl-3">
            <button
              type="button"
              onClick={() => setEditing({ mode: 'edit', habit })}
              className="-my-1 flex min-w-0 flex-1 items-center gap-3 rounded-md py-2 text-left"
              aria-label={`Edit ${habit.name}`}
            >
              <HabitGlyph habit={habit} />
              <span className="truncate text-body">{habit.name}</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  icon={<Ellipsis />}
                  label={`More options for ${habit.name}`}
                  variant="subtle"
                  size="sm"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditing({ mode: 'edit', habit })}>
                  <Pencil aria-hidden="true" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(habit)}>
                  <Trash2 aria-hidden="true" />
                  Delete…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setEditing({ mode: 'create' })}
            className="flex min-h-14 w-full items-center gap-3 rounded-b-lg px-3 text-left text-body font-medium text-foreground transition-colors duration-fast hover:bg-muted"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-surface-tertiary">
              <Plus className="size-4" aria-hidden="true" />
            </span>
            Add Habit
          </button>
        </li>
      </ul>

      <HabitEditorDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        {...(editingHabit ? { habit: editingHabit } : {})}
        defaultColor={pickNextColor(
          habits.map((habit) => habit.color),
          HABIT_COLORS,
        )}
        takenNames={takenNames}
        onDelete={() => {
          if (!editingHabit) return
          setEditing(null)
          setDeleting(editingHabit)
        }}
        onSave={(draft) =>
          editingHabit ? updateHabit({ habitId: editingHabit.id, changes: draft }) : addHabit(draft)
        }
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete “${deleting?.name ?? ''}”?`}
        description="This removes the habit and its entire history. This can’t be undone."
        confirmLabel="Delete Habit"
        destructive
        onConfirm={() => deleting && removeHabit(deleting.id)}
      />
    </>
  )
}
