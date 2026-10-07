import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export type PremiumButtonProps = ComponentProps<'button'> & {
  size?: 'md' | 'lg'
}

const BORDER_GRADIENT =
  'conic-gradient(var(--color-premium-pink), var(--color-premium-violet), var(--color-premium-blue), var(--color-premium-teal), var(--color-premium-violet), var(--color-premium-pink))'

const SHINE_GRADIENT =
  'linear-gradient(100deg, transparent 35%, color-mix(in oklch, var(--color-premium-violet) 30%, transparent) 50%, transparent 65%)'

/** The Premium call to action: a light button inside a circling gradient border that softly glows. */
export function PremiumButton({
  size = 'lg',
  className,
  children,
  type = 'button',
  ...props
}: PremiumButtonProps) {
  return (
    <div
      className={cn(
        'relative isolate animate-premium-glow overflow-hidden rounded-xl p-0.5',
        'transition-transform duration-fast has-[button:active]:scale-[0.98] has-[button:disabled]:opacity-60',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[140%] -translate-1/2 animate-border-spin"
        style={{ background: BORDER_GRADIENT }}
      />
      <button
        type={type}
        className={cn(
          'relative block w-full overflow-hidden rounded-[calc(var(--radius-xl)-2px)] bg-premium-cta font-semibold text-premium-cta-foreground',
          size === 'lg' ? 'h-13 text-[1rem] tracking-[-0.01em]' : 'h-11 text-body',
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-shine"
          style={{ background: SHINE_GRADIENT }}
        />
        <span className="relative">{children}</span>
      </button>
    </div>
  )
}
