import { Ellipsis, EyeOff, Pencil } from 'lucide-react'
import { useState } from 'react'

import targetIconUrl from '@/assets/icons/target.svg'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
} from '@/components/ui'
import { useVisibleHabits } from '@/hooks'
import { formatFullDate, formatMediumDate, fromDateKey } from '@/lib/calendar'
import { isPromiseShown } from '@/lib/habits'
import { cn } from '@/lib/utils'
import { useAppActions, useAppState } from '@/state'
import type { Habit } from '@/types'

import { HabitEditorDialog } from './HabitEditorDialog'
import { HabitGlyph } from './HabitGlyph'

/**
 * Promises the user made for the habits on screen, as a compact strip above
 * the calendar. Each one can be hidden or edited from its menu.
 */
export function PromisePanel({ className }: { className?: string }) {
  const { habits } = useAppState()
  const { updateHabit } = useAppActions()
  const promises = useVisibleHabits().filter(isPromiseShown)
  const [editing, setEditing] = useState<Habit | null>(null)

  return (
    <>
      {promises.length > 0 && (
        <ul aria-label="My promises" className={cn('space-y-1 px-3 pt-2', className)}>
          {promises.map((habit) => (
            <PromiseRow
              key={habit.id}
              habit={habit}
              // With several promises, the habit icon tells them apart.
              showHabit={promises.length > 1}
              onHide={() => updateHabit({ habitId: habit.id, changes: { showPromise: false } })}
              onEdit={() => setEditing(habit)}
            />
          ))}
        </ul>
      )}
      <HabitEditorDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        {...(editing ? { habit: editing } : {})}
        defaultColor={editing?.color ?? 'green'}
        takenNames={habits.map((habit) => habit.name)}
        onSave={(draft) => editing && updateHabit({ habitId: editing.id, changes: draft })}
      />
    </>
  )
}

type PromiseRowProps = {
  habit: Habit
  showHabit: boolean
  onHide: () => void
  onEdit: () => void
}

function PromiseRow({ habit, showHabit, onHide, onEdit }: PromiseRowProps) {
  const target = habit.targetDate ? fromDateKey(habit.targetDate) : null

  return (
    <li className="flex items-center gap-2 rounded-lg bg-surface-secondary py-1 pr-1 pl-3 text-caption">
      {showHabit && <HabitGlyph habit={habit} size="sm" className="-ml-1.5 size-5" />}
      {/* The promise text truncates first so the target date always stays visible. */}
      <p className="flex min-w-0 flex-1 items-center gap-1 whitespace-nowrap">
        {habit.promise && (
          <span className="min-w-0 truncate">
            <span className="font-medium text-muted-foreground">My promise</span>{' '}
            <span className="text-foreground">{habit.promise}</span>
          </span>
        )}
        {target && (
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
            {habit.promise ? 'till' : 'Till'}
            <img src={targetIconUrl} alt="" width={16} height={16} className="size-4" />
            <time
              dateTime={habit.targetDate}
              title={formatFullDate(target)}
              className="font-medium text-foreground"
            >
              {formatMediumDate(target)}
            </time>
          </span>
        )}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={<Ellipsis />}
            label={`More options for the ${habit.name} promise`}
            variant="subtle"
            size="sm"
            className="size-6 shrink-0"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil aria-hidden="true" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onHide}>
            <EyeOff aria-hidden="true" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
