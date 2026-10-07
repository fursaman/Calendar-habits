import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

const importFire = () =>
  Promise.all([
    import('lottie-web/build/player/lottie_light'),
    import('@/assets/animations/fire.json'),
  ])

let fireModules: ReturnType<typeof importFire> | undefined

/** Loads the Lottie player and the fire data once, shared by every fire. */
function loadFire() {
  fireModules ??= importFire()
  return fireModules
}

// Fetch the fire as soon as the browser is idle after startup, so it is ready
// before the first streak popup opens instead of loading while it shows.
if (typeof window !== 'undefined') {
  const preload = () => void loadFire()
  if ('requestIdleCallback' in window) window.requestIdleCallback(preload, { timeout: 2000 })
  else globalThis.setTimeout(preload, 1000)
}

/**
 * The animated fire (Lottie). The player and animation data are split out of
 * the main bundle and preloaded once the app is idle. With reduced motion it
 * shows a still frame.
 */
export function FireAnimation({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let disposed = false
    let destroy: (() => void) | undefined

    void loadFire().then(([{ default: lottie }, { default: animationData }]) => {
      if (disposed) return
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const animation = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: !still,
        autoplay: !still,
        animationData,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      })
      destroy = () => animation.destroy()
    })

    return () => {
      disposed = true
      destroy?.()
    }
  }, [])

  return <div ref={containerRef} aria-hidden="true" className={cn('shrink-0', className)} />
}
