/**
 * yahooAdapter.ts
 *
 * Wraps the yahoo-finance2 library and maps its raw response shapes to the
 * internal Quote and HistoryPoint types. All Yahoo-specific details are
 * confined to this file and normalized before returning to the data layer.
 */

import type { HistoryPoint, Quote, TimeWindow } from '../types/finance'
import { FinanceError } from '../types/finance'
import { normalizeHistoryPoints, normalizeQuote } from '../utils/normalise'

let _client: any = null

async function getYahooFinanceClient(): Promise<any> {
  if (_client) return _client
  const pkg = 'yahoo-finance2'
  const mod = await import(/* @vite-ignore */ pkg)
  const YahooFinance = mod.default ?? mod
  if (typeof YahooFinance === 'function') {
    try {
      _client = new YahooFinance({ suppressNotices: ['yahooSurvey'] })
    } catch {
      _client = YahooFinance
    }
  } else {
    _client = YahooFinance
  }
  return _client
}

function getChartPeriod(timeWindow: TimeWindow) {
  const now = Date.now()
  if (timeWindow === 'day') {
    return {
      period1: new Date(now - 24 * 60 * 60 * 1000),
      interval: '5m' as const,
    }
  }
  if (timeWindow === 'quarter') {
    return {
      period1: new Date(now - 90 * 24 * 60 * 60 * 1000),
      interval: '1d' as const,
    }
  }
  return {
    period1: new Date(now - 7 * 24 * 60 * 60 * 1000),
    interval: '1d' as const,
  }
}

const isBrowser =
  typeof globalThis.window !== 'undefined' &&
  typeof globalThis.fetch === 'function' &&
  ((globalThis as any).process?.env?.NODE_ENV !== 'test' && !import.meta.env?.MODE?.includes('test'))

// ---------------------------------------------------------------------------
// Yahoo provider implementation
// ---------------------------------------------------------------------------

async function fetchQuote(symbol: string): Promise<Quote> {
  const sym = symbol.toUpperCase()
  try {
    if (isBrowser) {
      const res = await globalThis.fetch(`/api/finance/quote?symbol=${encodeURIComponent(sym)}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new FinanceError(sym, 'not_found', `Symbol "${sym}" not found on Yahoo Finance`)
        }
        throw new FinanceError(sym, 'network', `HTTP ${res.status} fetching quote for ${sym}`)
      }
      const result = await res.json()
      const price = result?.price
      if (!price || (price.regularMarketPrice == null && price.postMarketPrice == null)) {
        throw new FinanceError(sym, 'parse', `Missing price data in Yahoo response for ${sym}`)
      }
      return normalizeQuote(
        {
          symbol: sym,
          name: price.shortName ?? price.longName ?? sym,
          price: price.regularMarketPrice ?? price.postMarketPrice,
          previousClose: price.regularMarketPreviousClose ?? price.regularMarketPrice,
          change: price.regularMarketChange,
          regularMarketChangePercent: price.regularMarketChangePercent,
          updatedAt: new Date().toISOString(),
        },
        sym,
      )
    }

    const yahooFinance = await getYahooFinanceClient()
    const result = await yahooFinance.quoteSummary(sym, {
      modules: ['price', 'summaryDetail'],
    })

    const price = result?.price
    if (!price || (price.regularMarketPrice == null && price.postMarketPrice == null)) {
      throw new FinanceError(sym, 'parse', `Missing price data in Yahoo response for ${sym}`)
    }

    return normalizeQuote(
      {
        symbol: sym,
        name: price.shortName ?? price.longName ?? sym,
        price: price.regularMarketPrice ?? price.postMarketPrice,
        previousClose: price.regularMarketPreviousClose ?? price.regularMarketPrice,
        change: price.regularMarketChange,
        regularMarketChangePercent: price.regularMarketChangePercent,
        updatedAt: new Date().toISOString(),
      },
      sym,
    )
  } catch (err) {
    if (err instanceof FinanceError) throw err
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('404') || message.toLowerCase().includes('not found')) {
      throw new FinanceError(sym, 'not_found', `Symbol "${sym}" not found on Yahoo Finance`)
    }
    throw new FinanceError(sym, 'network', `Failed to fetch quote for ${sym}: ${message}`)
  }
}

async function fetchHistory(symbol: string, timeWindow: TimeWindow): Promise<HistoryPoint[]> {
  const sym = symbol.toUpperCase()
  try {
    if (isBrowser) {
      const res = await globalThis.fetch(
        `/api/finance/history?symbol=${encodeURIComponent(sym)}&window=${encodeURIComponent(timeWindow)}`,
      )
      if (!res.ok) {
        if (res.status === 404) {
          throw new FinanceError(sym, 'not_found', `Symbol "${sym}" history not found on Yahoo Finance`)
        }
        throw new FinanceError(sym, 'network', `HTTP ${res.status} fetching history for ${sym}`)
      }
      const result = await res.json()
      const quotes = result?.quotes ?? []
      const normalized = normalizeHistoryPoints(quotes)

      // Market closed: intraday window returns no data — fall back to last 7 days of daily closes
      if (normalized.length === 0 && timeWindow === 'day') {
        const fallbackRes = await globalThis.fetch(
          `/api/finance/history?symbol=${encodeURIComponent(sym)}&window=7d`,
        )
        if (fallbackRes.ok) {
          const fallbackResult = await fallbackRes.json()
          const fallbackNormalized = normalizeHistoryPoints(fallbackResult?.quotes ?? [])
          if (fallbackNormalized.length > 0) {
            return fallbackNormalized
          }
        }
        throw new FinanceError(sym, 'parse', `No historical price data found for ${sym}`)
      }

      if (normalized.length === 0) {
        throw new FinanceError(sym, 'parse', `No historical price data found for ${sym}`)
      }

      return normalized
    }

    const yahooFinance = await getYahooFinanceClient()
    const params = getChartPeriod(timeWindow)
    const result = await yahooFinance.chart(sym, {
      period1: params.period1,
      interval: params.interval,
    })

    const quotes = result?.quotes ?? []
    const normalized = normalizeHistoryPoints(quotes)

    // Market closed: intraday window returns no data — fall back to last 7 days of daily closes
    if (normalized.length === 0 && timeWindow === 'day') {
      const fallbackParams = getChartPeriod('7d')
      const fallbackResult = await yahooFinance.chart(sym, {
        period1: fallbackParams.period1,
        interval: fallbackParams.interval,
      })
      const fallbackNormalized = normalizeHistoryPoints(fallbackResult?.quotes ?? [])
      if (fallbackNormalized.length > 0) {
        return fallbackNormalized
      }
      throw new FinanceError(sym, 'parse', `No historical price data found for ${sym}`)
    }

    if (normalized.length === 0) {
      throw new FinanceError(sym, 'parse', `No historical price data found for ${sym}`)
    }

    return normalized
  } catch (err) {
    if (err instanceof FinanceError) throw err
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('404') || message.toLowerCase().includes('not found')) {
      throw new FinanceError(sym, 'not_found', `Symbol "${sym}" history not found on Yahoo Finance`)
    }
    throw new FinanceError(sym, 'network', `Failed to fetch history for ${sym}: ${message}`)
  }
}

export const yahooProvider = { fetchQuote, fetchHistory }
