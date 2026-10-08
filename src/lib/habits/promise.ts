import type { Habit } from '@/types'

import { MAX_PROMISE_LENGTH } from './defaults'

export type HabitPromise = Pick<Habit, 'promise' | 'targetDate' | 'showPromise'>

export function normalizePromise(promise: string): string {
  return promise.trim().replace(/\s+/g, ' ').slice(0, MAX_PROMISE_LENGTH)
}

/** A habit has a promise when it has promise text, a target date, or both. */
export function hasPromise(habit: HabitPromise): boolean {
  return !!habit.promise || !!habit.targetDate
}

/** Whether the promise belongs on the calendar: set, and not hidden by the user. */
export function isPromiseShown(habit: HabitPromise): boolean {
  return hasPromise(habit) && habit.showPromise !== false
}
