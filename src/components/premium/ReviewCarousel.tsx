import { Star } from 'lucide-react'
import { type PointerEvent, useEffect, useRef, useState } from 'react'

import { useMediaQuery } from '@/hooks'
import { REVIEWS } from '@/lib/premium'
import { cn } from '@/lib/utils'

import { ReviewAvatar } from './ReviewAvatar'

const INTERVAL_MS = 6500
const LEAVE_MS = 450
/** Horizontal travel (px) that counts as a swipe. */
const SWIPE_THRESHOLD = 30

/**
 * One quiet card whose text fades to the next review every few seconds.
 * Holding the card pauses it; swiping moves between reviews.
 */
export function ReviewCarousel() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [held, setHeld] = useState(false)
  const startX = useRef<number | null>(null)

  function go(step: number) {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => {
      setIndex((current) => (current + step + REVIEWS.length) % REVIEWS.length)
      setLeaving(false)
    }, LEAVE_MS)
  }

  useEffect(() => {
    if (held || leaving || reducedMotion) return
    const timer = window.setTimeout(() => go(1), INTERVAL_MS)
    return () => window.clearTimeout(timer)
  })

  function onPointerDown(event: PointerEvent) {
    startX.current = event.clientX
    setHeld(true)
  }

  function onPointerEnd(event: PointerEvent) {
    if (startX.current === null) return
    const distance = event.clientX - startX.current
    startX.current = null
    setHeld(false)
    if (Math.abs(distance) > SWIPE_THRESHOLD) go(distance < 0 ? 1 : -1)
  }

  const review = REVIEWS[index]!
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Reviews"
      className="h-29.5 touch-pan-y overflow-hidden rounded-xl border border-premium-foreground/5 bg-premium-foreground/4 px-4.5 py-4 select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerEnd}
      onPointerLeave={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <figure
        key={index}
        aria-roledescription="slide"
        className={cn(
          'm-0 flex h-full flex-col justify-between gap-2.5 transition-[opacity,transform] duration-[450ms]',
          leaving ? '-translate-y-1.5 opacity-0' : 'animate-review-in',
        )}
      >
        <blockquote className="text-body text-premium-foreground/92">{review.quote}</blockquote>
        <figcaption className="flex items-center gap-2.5">
          <ReviewAvatar review={review} />
          <span className="min-w-0">
            <span className="block text-label font-semibold">{review.name}</span>
            <span className="block text-caption text-premium-foreground/50 tabular-nums">
              {review.streak}
            </span>
          </span>
          <span className="ml-auto flex gap-0.5 text-premium-star" role="img" aria-label="5 stars">
            {Array.from({ length: 5 }, (_, star) => (
              <Star
                key={star}
                aria-hidden="true"
                className="size-2.75 fill-current"
                strokeWidth={0}
              />
            ))}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
