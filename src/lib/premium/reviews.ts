export type ReviewPortrait = {
  background: string
  skin: string
  hair: string
  shirt: string
  hairStyle: 'short' | 'long' | 'bun'
}

export type Review = {
  quote: string
  name: string
  streak: string
  /** Illustrated stand-in until real customer photos are available. */
  portrait?: ReviewPortrait
}

/** Placeholder reviews for the paywall. Replace with real App Store reviews. */
export const REVIEWS: readonly Review[] = [
  {
    quote: "I've tried every habit app. This is the first one I still open after three months.",
    name: 'Daniel R.',
    streak: '112-day streak',
    portrait: {
      background: '#c7d2fe',
      skin: '#e8b896',
      hair: '#3b2a20',
      shirt: '#334155',
      hairStyle: 'short',
    },
  },
  {
    quote: 'Seeing my habits as colours on a calendar is what finally made them stick.',
    name: 'Maya K.',
    streak: '64-day streak',
    portrait: {
      background: '#fbcfe8',
      skin: '#c98e6b',
      hair: '#1f1512',
      shirt: '#7c3aed',
      hairStyle: 'long',
    },
  },
  {
    quote: "Watching the year fill with colour is the reason I don't skip a day.",
    name: 'Sofia L.',
    streak: '203-day streak',
    portrait: {
      background: '#a7f3d0',
      skin: '#f1c9a8',
      hair: '#b7793f',
      shirt: '#0f766e',
      hairStyle: 'bun',
    },
  },
  {
    quote: 'Quiet, beautiful and no guilt trips. Exactly what I was looking for.',
    name: 'Jonas M.',
    streak: '47-day streak',
  },
]
