import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button, IconButton } from '@/components/ui'
import { cn } from '@/lib/utils'

export type DateNavigatorProps = {
  /** Centered between the arrows; omit for arrows only. */
  label?: ReactNode
  onPrevious: () => void
  onNext: () => void
  previousLabel: string
  nextLabel: string
  /** Shows a Today button when provided. */
  onToday?: () => void
  isToday?: boolean
  /** Tooltips are useful on desktop toolbars, noise inside the panel. */
  tooltips?: boolean
  todayClassName?: string
  arrowClassName?: string
  className?: string
}

/** Previous / label / next, plus an optional Today shortcut. Used in the toolbar and habit panel. */
export function DateNavigator({
  label,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  onToday,
  isToday = false,
  tooltips = false,
  todayClassName,
  arrowClassName,
  className,
}: DateNavigatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <IconButton
        icon={<ChevronLeft />}
        label={previousLabel}
        tooltip={tooltips}
        className={arrowClassName}
        onClick={onPrevious}
        size="sm"
      />
      {label !== undefined && <div className="min-w-0 flex-1 text-center">{label}</div>}
      <IconButton
        icon={<ChevronRight />}
        label={nextLabel}
        tooltip={tooltips}
        className={arrowClassName}
        onClick={onNext}
        size="sm"
      />
      {onToday && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          disabled={isToday}
          className={cn('ml-1 rounded-pill', todayClassName)}
        >
          Today
        </Button>
      )}
    </div>
  )
}
