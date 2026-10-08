import {
  type Announcements,
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EllipsisVertical, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'
import type { Habit } from '@/types'
import { HABIT_COLORS } from '@/types'

import { HabitEditorDialog } from './HabitEditorDialog'
import { HabitGlyph } from './HabitGlyph'

type Editing = { mode: 'create' } | { mode: 'edit'; habit: Habit } | null

/**
 * Add, edit, delete, and reorder habits. The order here is the order used
 * everywhere. Deleting always asks for confirmation.
 */
export function HabitManager() {
  const { habits } = useAppState()
  const { addHabit, updateHabit, removeHabit, reorderHabit } = useAppActions()
  const sensors = useSensors(
    // A small distance lets taps on the handle still focus it without dragging.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const nameOf = (id: UniqueIdentifier) => habits.find((habit) => habit.id === id)?.name ?? ''
  const positionOf = (id: UniqueIdentifier) => habits.findIndex((habit) => habit.id === id) + 1
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${nameOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${nameOf(active.id)} moved to position ${positionOf(over.id)} of ${habits.length}.`
        : '',
    onDragEnd: ({ active, over }) =>
      over ? `${nameOf(active.id)} dropped at position ${positionOf(over.id)}.` : '',
    onDragCancel: ({ active }) => `Reordering cancelled. ${nameOf(active.id)} returned.`,
  }
  const [editing, setEditing] = useState<Editing>(null)
  const [deleting, setDeleting] = useState<Habit | null>(null)

  const editingHabit = editing?.mode === 'edit' ? editing.habit : undefined
  const takenNames = habits.map((habit) => habit.name)

  return (
    <>
      <ul aria-label="Your habits" className="divide-y divide-border-subtle">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          accessibility={{ announcements }}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return
            reorderHabit({
              habitId: String(active.id),
              toIndex: habits.findIndex((habit) => habit.id === over.id),
            })
          }}
        >
          <SortableContext
            items={habits.map((habit) => habit.id)}
            strategy={verticalListSortingStrategy}
          >
            {habits.map((habit) => (
              <SortableHabitItem
                key={habit.id}
                habit={habit}
                onEdit={() => setEditing({ mode: 'edit', habit })}
                onDelete={() => setDeleting(habit)}
              />
            ))}
          </SortableContext>
        </DndContext>
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

type SortableHabitItemProps = {
  habit: Habit
  onEdit: () => void
  onDelete: () => void
}

/** One habit row with a drag handle (pointer, touch, or Space + arrow keys). */
function SortableHabitItem({ habit, onEdit, onDelete }: SortableHabitItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'relative flex min-h-14 items-center gap-2 pr-2 pl-1',
        // The lifted row gets its own surface so it reads above the list.
        isDragging && 'z-10 rounded-lg bg-sheet shadow-elevated',
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label={`Reorder ${habit.name}`}
        className="inline-flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-faint-foreground transition-colors duration-fast hover:bg-muted hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="-my-1 flex min-w-0 flex-1 items-center gap-3 rounded-md py-2 text-left"
        aria-label={`Edit ${habit.name}`}
      >
        <HabitGlyph habit={habit} />
        <span className="truncate text-body">{habit.name}</span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={<EllipsisVertical />}
            label={`More options for ${habit.name}`}
            variant="subtle"
            size="sm"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" tone="raised">
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil aria-hidden="true" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            <Trash2 aria-hidden="true" />
            Delete…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
