import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type Glow = { color: string; strength: number; className: string }

const GLOWS: Record<'sheet' | 'card', readonly Glow[]> = {
  sheet: [
    { color: 'violet', strength: 95, className: '-top-[30%] -left-[55%] w-[120%] animate-aura-1' },
    { color: 'pink', strength: 85, className: '-top-[25%] -right-[60%] w-[120%] animate-aura-2' },
    { color: 'blue', strength: 85, className: '-top-[20%] -left-[10%] w-full animate-aura-3' },
    { color: 'teal', strength: 70, className: 'top-[10%] -right-[40%] w-full animate-aura-4' },
    { color: 'indigo', strength: 70, className: 'top-[45%] -left-[45%] w-[110%] animate-aura-5' },
    { color: 'fuchsia', strength: 55, className: 'top-[62%] -right-[50%] w-[110%] animate-aura-6' },
  ],
  card: [
    { color: 'violet', strength: 90, className: '-top-[60%] -left-[35%] w-[90%] animate-aura-1' },
    { color: 'pink', strength: 75, className: '-top-[50%] -right-[35%] w-[90%] animate-aura-2' },
    { color: 'blue', strength: 70, className: 'top-[20%] left-[10%] w-[90%] animate-aura-3' },
    { color: 'teal', strength: 55, className: 'top-[40%] -right-[20%] w-[90%] animate-aura-4' },
  ],
}

/** Darkens the glows enough to keep text readable on top of them. */
const VEILS = {
  sheet:
    'linear-gradient(180deg, oklch(0.14 0.03 300 / 0.05) 0%, oklch(0.14 0.03 300 / 0.35) 40%, oklch(0.14 0.03 300 / 0.6) 70%, oklch(0.14 0.03 300 / 0.72) 100%)',
  card: 'oklch(0.14 0.03 300 / 0.35)',
}

function glowStyle({ color, strength }: Glow): CSSProperties {
  return {
    background: `radial-gradient(closest-side, color-mix(in oklch, var(--color-premium-${color}) ${strength}%, transparent), transparent)`,
  }
}

/**
 * Soft color glows that drift and fade behind Premium surfaces. They only
 * animate transform and opacity, with no blur filters, so they stay smooth.
 */
export function PremiumAura({ variant = 'sheet' }: { variant?: 'sheet' | 'card' }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {GLOWS[variant].map((glow) => (
        <span
          key={glow.color}
          className={cn(
            'absolute aspect-square rounded-full will-change-transform',
            glow.className,
          )}
          style={glowStyle(glow)}
        />
      ))}
      <span className="absolute inset-0" style={{ background: VEILS[variant] }} />
    </div>
  )
}
