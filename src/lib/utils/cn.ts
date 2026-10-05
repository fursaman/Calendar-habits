import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** tailwind-merge needs our custom token names to resolve conflicts correctly. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'heading',
        'title',
        'body',
        'input',
        'label',
        'caption',
        'nav',
        'date',
        'date-sm',
        'weekday',
      ],
      shadow: ['subtle', 'floating', 'elevated', 'modal'],
      radius: ['sm', 'md', 'lg', 'xl', 'pill', 'control'],
      container: ['content', 'sheet', 'dialog'],
      spacing: [
        'touch',
        'control-sm',
        'control-md',
        'control-lg',
        'day-marker',
        'dot',
        'dot-sm',
        'sheet-peek',
        'cell-min',
      ],
    },
  },
})

/** Joins class names and resolves conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
