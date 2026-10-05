/** Shared overlay styles for Dialog and BottomSheet backdrops. */
export const overlayClassName =
  'fixed inset-0 z-(--z-overlay) bg-overlay data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out'

/** Shared floating-surface styles for Popover and DropdownMenu. */
export const floatingSurfaceClassName =
  'z-(--z-dropdown) rounded-xl border border-border bg-surface text-foreground shadow-md data-[state=open]:animate-pop-in data-[state=closed]:animate-fade-out'
