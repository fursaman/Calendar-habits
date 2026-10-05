/**
 * Locale-aware display formatting. Uses Intl so labels follow the user's
 * language without bundling date-fns locales.
 */

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(options: Intl.DateTimeFormatOptions, locale?: string) {
  const cacheKey = `${locale ?? ''}|${JSON.stringify(options)}`
  let formatter = formatterCache.get(cacheKey)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options)
    formatterCache.set(cacheKey, formatter)
  }
  return formatter
}

/** "October 2026" */
export function formatMonthYear(date: Date, locale?: string): string {
  return getFormatter({ month: 'long', year: 'numeric' }, locale).format(date)
}

/** "Oct" */
export function formatMonthShort(date: Date, locale?: string): string {
  return getFormatter({ month: 'short' }, locale).format(date)
}

/** "Mon" or "M" */
export function formatWeekday(
  date: Date,
  width: 'short' | 'narrow' = 'short',
  locale?: string,
): string {
  return getFormatter({ weekday: width }, locale).format(date)
}

/** "Monday, October 5, 2026" — suitable for accessible labels. */
export function formatFullDate(date: Date, locale?: string): string {
  return getFormatter({ dateStyle: 'full' }, locale).format(date)
}

/** "5" */
export function formatDayOfMonth(date: Date, locale?: string): string {
  return getFormatter({ day: 'numeric' }, locale).format(date)
}
