import { Trash2 } from 'lucide-react'
import { type FormEvent, useId, useRef, useState } from 'react'

import { Button, Dialog, DialogContent, Input, Label, Toggle } from '@/components/ui'
import { isDateKey, tomorrowKey } from '@/lib/calendar'
import {
  type HabitPromise,
  MAX_HABIT_NAME_LENGTH,
  MAX_PROMISE_LENGTH,
  normalizeHabitName,
  promiseFields,
} from '@/lib/habits'
import type { Habit, HabitColor, HabitIcon } from '@/types'

import { HabitColorPicker } from './HabitColorPicker'
import { HabitGlyph } from './HabitGlyph'
import { HabitIconPicker } from './HabitIconPicker'

export type HabitDraft = { name: string; color: HabitColor; icon?: HabitIcon } & HabitPromise

export type HabitEditorDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Existing habit to edit; omit to create a new one. */
  habit?: Habit
  defaultColor: HabitColor
  onSave: (draft: HabitDraft) => void
  /** Names already in use, to prevent confusing duplicates. */
  takenNames: readonly string[]
  /** Shown for existing habits; the caller asks for confirmation. */
  onDelete?: () => void
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
  onDelete,
}: HabitEditorDialogProps) {
  const [name, setName] = useState(habit?.name ?? '')
  const [color, setColor] = useState<HabitColor>(habit?.color ?? defaultColor)
  const [icon, setIcon] = useState<HabitIcon | undefined>(habit?.icon)
  const [promise, setPromise] = useState(habit?.promise ?? '')
  const [targetDate, setTargetDate] = useState<string>(habit?.targetDate ?? '')
  const [showPromise, setShowPromise] = useState(habit?.showPromise !== false)
  const ids = {
    name: useId(),
    color: useId(),
    icon: useId(),
    error: useId(),
    promise: useId(),
    targetDate: useId(),
    showPromise: useId(),
  }
  const nameRef = useRef<HTMLInputElement>(null)

  const normalized = normalizeHabitName(name)
  const duplicate = takenNames.some(
    (taken) => taken.toLowerCase() === normalized.toLowerCase() && taken !== habit?.name,
  )
  const canSave = normalized.length > 0 && !duplicate
  const hasPromise = promise.trim() !== '' || targetDate !== ''
  // Only future days, but an existing date that has since passed stays valid.
  const tomorrow = tomorrowKey()
  const minDate = habit?.targetDate && habit.targetDate < tomorrow ? habit.targetDate : tomorrow

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!canSave) return
    onSave({
      name: normalized,
      color,
      ...(icon ? { icon } : {}),
      // Explicitly unset promise fields so clearing them while editing removes them.
      promise: undefined,
      targetDate: undefined,
      showPromise: undefined,
      ...promiseFields({
        promise,
        ...(isDateKey(targetDate) ? { targetDate } : {}),
        showPromise,
      }),
    })
    onOpenChange(false)
  }

  return (
    <DialogContent
      title={habit ? 'Edit Habit' : 'New Habit'}
      // New habits start in the name field; editing doesn't pop up the keyboard.
      onOpenAutoFocus={(event) => {
        if (habit) return
        event.preventDefault()
        // The dialog is still sliding in, so a plain focus would scroll the form to its end.
        nameRef.current?.focus({ preventScroll: true })
      }}
      footer={
        <>
          {habit && onDelete && (
            <Button variant="destructive-ghost" className="mr-auto" onClick={onDelete}>
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form={ids.name + '-form'} disabled={!canSave}>
            {habit ? 'Save' : 'Add Habit'}
          </Button>
        </>
      }
    >
      <form id={ids.name + '-form'} onSubmit={submit} className="space-y-6 pt-1">
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
          <Label htmlFor={ids.promise}>I promise to myself</Label>
          <Input
            id={ids.promise}
            value={promise}
            onChange={(event) => setPromise(event.target.value)}
            placeholder="e.g. Run a half marathon"
            maxLength={MAX_PROMISE_LENGTH}
            autoComplete="off"
            enterKeyHint="done"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor={ids.targetDate}>Target date</Label>
          <Input
            id={ids.targetDate}
            type="date"
            value={targetDate}
            min={minDate}
            onChange={(event) => setTargetDate(event.target.value)}
          />
        </div>
        {hasPromise && (
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor={ids.showPromise} className="text-body text-foreground">
              Show promise on calendar
            </Label>
            <Toggle id={ids.showPromise} checked={showPromise} onCheckedChange={setShowPromise} />
          </div>
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
