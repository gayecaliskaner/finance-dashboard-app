/**
 * normalise.ts
 *
 * Data normalisation and transformation layer for the finance dashboard.
 * Normalises raw responses from Yahoo Finance and provider adapters into
 * consistent domain models for quote summaries, short-term history,
 * and quarterly trend comparisons.
 */

import type { HistoryPoint, HistorySeries, Quote } from '../types/finance'
import { FinanceError } from '../types/finance'

/**
 * Normalise a date value from various raw formats (timestamp in s or ms, Date object, ISO string)
 * into a standardized YYYY-MM-DD date string.
 */
export function toISODate(dateVal: unknown): string {
  if (!dateVal) return new Date().toISOString().slice(0, 10)
  if (dateVal instanceof Date) {
    return dateVal.toISOString().slice(0, 10)
  }
  if (typeof dateVal === 'number') {
    // If timestamp is in seconds (e.g., Yahoo epoch < 1e11), convert to milliseconds
    const ms = dateVal < 1e11 ? dateVal * 1000 : dateVal
    const d = new Date(ms)
    return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10)
  }
  if (typeof dateVal === 'string') {
    const d = new Date(dateVal)
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10)
    }
    return dateVal.slice(0, 10)
  }
  return new Date().toISOString().slice(0, 10)
}

/**
 * Normalises raw quote data from Yahoo Finance / API into the application Quote domain model.
 * Throws FinanceError (kind "parse") when the price is missing or not a finite number.
 */
export function normalizeQuote(
  raw: Record<string, any>,
  fallbackSymbol = '',
): Quote {
  const symbol = (raw.symbol ?? fallbackSymbol ?? '').toUpperCase()
  const name =
    raw.name ??
    raw.shortName ??
    raw.longName ??
    raw.displayName ??
    symbol

  const price = typeof raw.price === 'number'
    ? raw.price
    : typeof raw.regularMarketPrice === 'number'
      ? raw.regularMarketPrice
      : Number(raw.price ?? raw.regularMarketPrice ?? 0)

  if (!Number.isFinite(price)) {
    throw new FinanceError(symbol, 'parse', `Invalid price in quote data for "${symbol}"`)
  }

  const previousClose = typeof raw.previousClose === 'number'
    ? raw.previousClose
    : typeof raw.regularMarketPreviousClose === 'number'
      ? raw.regularMarketPreviousClose
      : price

  let change = typeof raw.change === 'number'
    ? raw.change
    : typeof raw.regularMarketChange === 'number'
      ? raw.regularMarketChange
      : price - previousClose

  let changePercent: number
  if (typeof raw.changePercent === 'number') {
    changePercent = raw.changePercent
  } else if (typeof raw.regularMarketChangePercent === 'number') {
    changePercent =
      Math.abs(raw.regularMarketChangePercent) < 1 && raw.regularMarketChangePercent !== 0
        ? raw.regularMarketChangePercent * 100
        : raw.regularMarketChangePercent
  } else if (previousClose !== 0) {
    changePercent = ((price - previousClose) / previousClose) * 100
  } else {
    changePercent = 0
  }

  // Round values cleanly
  change = parseFloat(change.toFixed(2))
  changePercent = parseFloat(changePercent.toFixed(2))

  const updatedAt = raw.updatedAt ?? new Date().toISOString()

  return {
    symbol,
    name,
    price: parseFloat(price.toFixed(2)),
    previousClose: parseFloat(previousClose.toFixed(2)),
    change,
    changePercent,
    updatedAt,
  }
}

/**
 * Normalises raw historical points, filtering invalid entries,
 * standardizing dates, sorting chronologically, and deduplicating.
 */
export function normalizeHistoryPoints(rawPoints: unknown[]): HistoryPoint[] {
  if (!Array.isArray(rawPoints)) return []

  const validPoints: HistoryPoint[] = []
  const seenDates = new Set<string>()

  for (const raw of rawPoints) {
    if (!raw || typeof raw !== 'object') continue
    const item = raw as Record<string, any>
    const close = item.close ?? item.adjclose ?? item.price
    if (close == null || !Number.isFinite(Number(close))) continue

    const date = toISODate(item.date ?? item.timestamp)
    if (!date) continue

    validPoints.push({
      date,
      close: parseFloat(Number(close).toFixed(2)),
    })
  }

  // Sort chronologically
  validPoints.sort((a, b) => a.date.localeCompare(b.date))

  // Deduplicate by date keeping latest
  const deduped: HistoryPoint[] = []
  for (const p of validPoints) {
    if (!seenDates.has(p.date)) {
      seenDates.add(p.date)
      deduped.push(p)
    }
  }

  return deduped
}

/**
 * Rebase a single series so that the first data point equals 100.
 * Useful for comparative performance visualization across companies.
 */
export function rebaseTo100(points: HistoryPoint[]): HistoryPoint[] {
  if (points.length === 0) return []
  const base = points[0].close
  if (base === 0) return points
  return points.map((p) => ({
    date: p.date,
    close: parseFloat(((p.close / base) * 100).toFixed(2)),
  }))
}

/**
 * Rebase multiple series and merge them into a single array of objects
 * keyed by date. Suitable for feeding directly into Recharts AreaChart or LineChart.
 *
 * Returns an array like:
 *   [{ date: '2024-10-01', IBM: 100, MSFT: 100 }, { date: '2024-10-02', IBM: 101.2, MSFT: 99.8 }, …]
 */
export function mergeNormalisedSeries(
  series: HistorySeries[],
): Array<Record<string, number | string>> {
  const rebased = series.map((s) => ({
    symbol: s.symbol,
    points: rebaseTo100(s.data),
  }))

  // Collect all unique dates in order.
  const dateSet = new Set<string>()
  rebased.forEach((s) => s.points.forEach((p) => dateSet.add(p.date)))
  const dates = Array.from(dateSet).sort()

  return dates.map((date) => {
    const row: Record<string, number | string> = { date }
    rebased.forEach((s) => {
      const point = s.points.find((p) => p.date === date)
      if (point !== undefined) {
        row[s.symbol] = point.close
      }
    })
    return row
  })
}

/**
 * Calculates summary statistics for a given historical trend view (e.g. quarterly or 7-day).
 */
export function calculatePeriodStats(points: HistoryPoint[]): {
  start: number
  end: number
  min: number
  max: number
  change: number
  changePercent: number
} | null {
  if (!points || points.length === 0) return null

  const start = points[0].close
  const end = points[points.length - 1].close
  let min = points[0].close
  let max = points[0].close

  for (const p of points) {
    if (p.close < min) min = p.close
    if (p.close > max) max = p.close
  }

  const change = parseFloat((end - start).toFixed(2))
  const changePercent = start !== 0 ? parseFloat((((end - start) / start) * 100).toFixed(2)) : 0

  return {
    start,
    end,
    min,
    max,
    change,
    changePercent,
  }
}
