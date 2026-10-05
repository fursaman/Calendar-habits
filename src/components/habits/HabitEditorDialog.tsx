import { type FormEvent, useId, useRef, useState } from 'react'

import { Button, Dialog, DialogContent, Input, Label } from '@/components/ui'
import { MAX_HABIT_NAME_LENGTH, normalizeHabitName } from '@/lib/habits'
import type { Habit, HabitColor, HabitIcon } from '@/types'

import { HabitColorPicker } from './HabitColorPicker'
import { HabitGlyph } from './HabitGlyph'
import { HabitIconPicker } from './HabitIconPicker'

export type HabitDraft = { name: string; color: HabitColor; icon?: HabitIcon }

export type HabitEditorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Existing habit to edit; omit to create a new one. */
  habit?: Habit
  defaultColor: HabitColor
  onSave: (draft: HabitDraft) => void
  /** Names already in use, to prevent confusing duplicates. */
  takenNames: readonly string[]
}

export function HabitEditorDialog(props: HabitEditorDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {/* Remount the form for each opening so it starts from the habit's current values. */}
      {props.open && <HabitEditorForm {...props} />}
    </Dialog>
  )
}

function HabitEditorForm({
  onOpenChange,
  habit,
  defaultColor,
  onSave,
  takenNames,
}: HabitEditorDialogProps) {
  const [name, setName] = useState(habit?.name ?? '')
  const [color, setColor] = useState<HabitColor>(habit?.color ?? defaultColor)
  const [icon, setIcon] = useState<HabitIcon | undefined>(habit?.icon)
  const ids = { name: useId(), color: useId(), icon: useId(), error: useId() }
  const nameRef = useRef<HTMLInputElement>(null)

  const normalized = normalizeHabitName(name)
  const duplicate = takenNames.some(
    (taken) => taken.toLowerCase() === normalized.toLowerCase() && taken !== habit?.name,
  )
  const canSave = normalized.length > 0 && !duplicate

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!canSave) return
    onSave({ name: normalized, color, ...(icon ? { icon } : {}) })
    onOpenChange(false)
  }

  return (
    <DialogContent
      title={habit ? 'Edit Habit' : 'New Habit'}
      // New habits start in the name field; editing doesn't pop up the keyboard.
      onOpenAutoFocus={(event) => {
        if (habit) return
        event.preventDefault()
        nameRef.current?.focus()
      }}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={ids.name + '-form'} disabled={!canSave}>
            {habit ? 'Save' : 'Add Habit'}
          </Button>
        </>
      }
    >
      <form id={ids.name + '-form'} onSubmit={submit} className="space-y-6">
        <div className="flex items-center gap-3">
          <HabitGlyph habit={{ color, ...(icon ? { icon } : {}) }} size="lg" />
          <div className="flex-1 space-y-1.5">
            <Label htmlFor={ids.name} className="sr-only">
              Name
            </Label>
            <Input
              ref={nameRef}
              id={ids.name}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Habit name"
              maxLength={MAX_HABIT_NAME_LENGTH}
              autoComplete="off"
              enterKeyHint="done"
              invalid={duplicate}
              aria-describedby={duplicate ? ids.error : undefined}
            />
          </div>
        </div>
        {duplicate && (
          <p id={ids.error} className="-mt-4 text-caption text-destructive">
            You already have a habit with this name.
          </p>
        )}
        <div className="space-y-2.5">
          <Label id={ids.color}>Color</Label>
          <HabitColorPicker value={color} onValueChange={setColor} labelledBy={ids.color} />
        </div>
        <div className="space-y-2.5">
          <Label id={ids.icon}>Icon</Label>
          <HabitIconPicker
            value={icon}
            color={color}
            onValueChange={setIcon}
            labelledBy={ids.icon}
          />
        </div>
      </form>
    </DialogContent>
  )
}
