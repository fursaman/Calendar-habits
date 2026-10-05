import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

/**
 * The animated fire (Lottie). The player and animation data load on first
 * use, so they stay out of the main bundle. With reduced motion it shows a
 * still frame.
 */
export function FireAnimation({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let disposed = false
    let destroy: (() => void) | undefined

    void Promise.all([
      import('lottie-web/build/player/lottie_light'),
      import('@/assets/animations/fire.json'),
    ]).then(([{ default: lottie }, { default: animationData }]) => {
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
