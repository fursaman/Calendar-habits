import type { Habit } from '@/types'

/** Starter habits seeded on first launch. */
export const DEFAULT_HABITS: readonly Habit[] = [
  { id: 'sport', name: 'Sport', color: 'sport', createdAt: '2026-01-01T00:00:00.000Z' },
  {
    id: 'healthy-eating',
    name: 'Healthy eating',
    color: 'healthy-eating',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'no-doomscrolling',
    name: 'No doomscrolling',
    color: 'no-doomscrolling',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  { id: 'reading', name: 'Reading', color: 'reading', createdAt: '2026-01-01T00:00:00.000Z' },
]
