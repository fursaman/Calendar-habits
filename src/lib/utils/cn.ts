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
      radius: ['sm', 'md', 'lg', 'xl', 'pill'],
    },
  },
})

/** Joins class names and resolves conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
