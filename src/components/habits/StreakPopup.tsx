import { useEffect, useRef, useState } from 'react'

import { fromDateKey } from '@/lib/calendar'
import { cn } from '@/lib/utils'
import { type StreakCelebration, useAppActions, useAppState } from '@/state'
import type { Habit } from '@/types'

import { StreakCard, streakHaloClassName } from './StreakCard'

const VISIBLE_MS = 3000

/**
 * Celebrates extending a streak today. Drops in from the top like a Dynamic
 * Island panel, and closes after three seconds, on a tap outside, or Escape.
 */
export function StreakPopup() {
  const { celebration, habits } = useAppState()
  const habit = habits.find((item) => item.id === celebration?.habitId)
  // Re-key on each celebration so the entrance animation replays.
  return celebration && habit ? (
    <StreakPopupCard
      key={`${celebration.habitId}:${celebration.days}`}
      celebration={celebration}
      habit={habit}
    />
  ) : null
}

function StreakPopupCard({ celebration, habit }: { celebration: StreakCelebration; habit: Habit }) {
  const { dismissCelebration } = useAppActions()
  const cardRef = useRef<HTMLDivElement>(null)
  const [leaving, setLeaving] = useState(false)

  // Auto-close, and close on a tap outside or Escape.
  useEffect(() => {
    const close = () => setLeaving(true)
    const timer = window.setTimeout(close, VISIBLE_MS)
    const onPointerDown = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const date = fromDateKey(celebration.date)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-(--z-tooltip) flex justify-center px-3 pt-[max(--spacing(2),env(safe-area-inset-top))]">
      {/* A 4px halo of the panel color at 12% sits outside the panel. */}
      <div
        ref={cardRef}
        onAnimationEnd={(event) =>
          leaving && event.target === event.currentTarget && dismissCelebration()
        }
        className={cn(
          'pointer-events-auto w-full max-w-sm origin-top',
          streakHaloClassName,
          leaving ? 'animate-island-out' : 'animate-island-in',
        )}
      >
        <StreakCard
          habit={habit}
          days={celebration.days}
          date={date}
          role="status"
          aria-live="polite"
          className="shadow-modal"
        />
      </div>
    </div>
  )
}
