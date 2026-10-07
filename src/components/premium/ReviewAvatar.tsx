import type { Review, ReviewPortrait } from '@/lib/premium'

const HAIR: Record<ReviewPortrait['hairStyle'], string> = {
  short:
    'M12.6 17.5c-.6-7 3.2-10.8 7.6-10.8 4.6 0 8.2 3.4 7.4 10.6-.9-2.6-2.6-4.3-7.5-4.6-4.3.2-6.5 2-7.5 4.8z',
  long: 'M10.5 31c-.8-6-1-9.5-.6-14 .6-6.4 4.6-10.4 10-10.4s9.6 4 10.1 10.4c.4 4.5.2 8-.6 14h-4.2V17.8c-2.6-.8-5.6-2.6-7.2-5-1.2 2.4-2.8 4-4.7 5V31z',
  bun: 'M12.7 17.6c-.4-6.4 3-10.4 7.3-10.4 4.5 0 7.8 3.6 7.3 10.4-1.6-3-4.2-4.8-7.3-4.8s-5.7 1.8-7.3 4.8z',
}

/** An illustrated portrait, or initials when a review has none. */
export function ReviewAvatar({ review }: { review: Review }) {
  const { portrait } = review
  if (!portrait) {
    const initials = review.name
      .split(' ')
      .map((part) => part[0])
      .join('')
    return (
      <span
        aria-hidden="true"
        className="grid size-7.5 shrink-0 place-items-center rounded-full bg-premium-star text-caption font-semibold text-premium-cta-foreground"
      >
        {initials}
      </span>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className="size-7.5 shrink-0 rounded-full">
      <rect width="40" height="40" fill={portrait.background} />
      <path fill={portrait.shirt} d="M5 41c.8-8.5 7-12.6 15-12.6S34.2 32.5 35 41z" />
      <path fill={portrait.skin} opacity="0.85" d="M16.8 22h6.4v7.2a3.2 3.2 0 0 1-6.4 0z" />
      <ellipse cx="20" cy="17.6" rx="7.2" ry="8.2" fill={portrait.skin} />
      {portrait.hairStyle === 'bun' && <circle cx="20" cy="5.6" r="3.6" fill={portrait.hair} />}
      <path fill={portrait.hair} d={HAIR[portrait.hairStyle]} />
    </svg>
  )
}
