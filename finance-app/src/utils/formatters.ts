/**
 * formatters.ts
 *
 * Display-formatting helpers, semantic color tokens, and Carbon tag types.
 */

// ---------------------------------------------------------------------------
// Number / currency formatters
// ---------------------------------------------------------------------------

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format a number as a USD price string, e.g. "$182.34". */
export function formatPrice(value: number): string {
  if (value == null || isNaN(value)) return '$0.00'
  return USD.format(value)
}

/** Format a signed change value with explicit +/− prefix, e.g. "+2.24". */
export function formatChange(value: number): string {
  if (value == null || isNaN(value)) return '+0.00'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}`
}

/** Format a percentage change with +/− prefix, e.g. "+1.24%". */
export function formatPercent(value: number): string {
  if (value == null || isNaN(value)) return '+0.00%'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/** Format an ISO date string to a short locale date, e.g. "Oct 7". */
export function formatShortDate(isoDate: string): string {
  if (!isoDate) return ''
  const parts = isoDate.split('-')
  if (parts.length === 3) {
    // Avoid timezone offset shift by parsing year, monthIndex, day
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const day = parseInt(parts[2], 10)
    return new Date(year, month, day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format an ISO datetime string to a 12-hour time label for intraday charts.
 * e.g. "2024-10-07T09:30:00" → "9:30 AM"
 */
export function formatTime(isoDatetime: string): string {
  if (!isoDatetime) return ''
  // Parse the time portion directly to avoid timezone conversion
  const tIndex = isoDatetime.indexOf('T')
  if (tIndex !== -1) {
    const timePart = isoDatetime.slice(tIndex + 1, tIndex + 6) // "HH:MM"
    const [hhStr, mmStr] = timePart.split(':')
    const hh = parseInt(hhStr, 10)
    const mm = parseInt(mmStr, 10)
    const period = hh >= 12 ? 'PM' : 'AM'
    const h12 = hh % 12 === 0 ? 12 : hh % 12
    return `${h12}:${String(mm).padStart(2, '0')} ${period}`
  }
  // No time component (daily fallback) — show as a short date instead
  return formatShortDate(isoDatetime)
}

// ---------------------------------------------------------------------------
// Semantic colour & Carbon Tag helpers
// ---------------------------------------------------------------------------

/** Returns a CSS hex colour code based on value direction. */
export function changeColor(value: number): string {
  if (value > 0) return '#198038'  // Carbon green 60
  if (value < 0) return '#da1e28'  // Carbon red 60
  return '#525252'                  // Carbon gray 70
}

/** Returns the appropriate Carbon Tag type for directional values. */
export function changeTagType(value: number): 'green' | 'red' | 'gray' {
  if (value > 0) return 'green'
  if (value < 0) return 'red'
  return 'gray'
}
