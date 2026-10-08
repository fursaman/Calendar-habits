import { type RefObject, useLayoutEffect, useState } from 'react'

/** Whether an element's content is wider than the element, kept current as either resizes. */
export function useHorizontalOverflow(ref: RefObject<HTMLElement | null>): boolean {
  const [overflowing, setOverflowing] = useState(false)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setOverflowing(element.scrollWidth > element.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    for (const child of element.children) observer.observe(child)
    return () => observer.disconnect()
  }, [ref])

  return overflowing
}
