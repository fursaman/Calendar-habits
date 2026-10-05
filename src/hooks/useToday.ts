import { useEffect, useState } from 'react'

import { todayKey } from '@/lib/calendar'
import type { DateKey } from '@/types'

const MS_UNTIL_TOMORROW_PADDING = 1000

function msUntilNextMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime() + MS_UNTIL_TOMORROW_PADDING
}

/**
 * Today's date key, updated when the local day rolls over or the tab
 * becomes visible again (timers are throttled in background tabs).
 */
export function useToday(): DateKey {
  const [today, setToday] = useState(() => todayKey())

  useEffect(() => {
    const refresh = () => setToday(todayKey())
    let timer = window.setTimeout(function tick() {
      refresh()
      timer = window.setTimeout(tick, msUntilNextMidnight(new Date()))
    }, msUntilNextMidnight(new Date()))

    const onVisible = () => document.visibilityState === 'visible' && refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return today
}
