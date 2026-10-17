/**
 * financeService.ts
 *
 * Public interface for all data-fetching in the application.
 * Components and hooks depend only on this file — never on the adapter directly.
 *
 * The `provider` parameter allows injecting an alternative adapter (e.g. mockData)
 * for tests or offline operation. In production the default Yahoo adapter is used.
 */

import type { HistoryPoint, Quote, TimeWindow } from '../types/finance'
import { FinanceError } from '../types/finance'
import { normalizeHistoryPoints, normalizeQuote } from '../utils/normalise'
import { MOCK_HISTORY, MOCK_QUOTES } from './mockData'

// ---------------------------------------------------------------------------
// Provider interface — any adapter must satisfy these methods.
// ---------------------------------------------------------------------------

export interface FinanceProvider {
  fetchQuote(symbol: string): Promise<Quote>
  fetchHistory(symbol: string, window: TimeWindow): Promise<HistoryPoint[]>
}

// ---------------------------------------------------------------------------
// Default mock provider (used when Yahoo is unavailable or in tests).
// ---------------------------------------------------------------------------

export const mockProvider: FinanceProvider = {
  async fetchQuote(symbol: string): Promise<Quote> {
    const sym = symbol.toUpperCase()
    const quote = MOCK_QUOTES[sym]
    if (!quote) {
      throw new FinanceError(sym, 'not_found', `No mock data for symbol "${sym}"`)
    }
    return normalizeQuote(quote, sym)
  },

  async fetchHistory(symbol: string, _window: TimeWindow): Promise<HistoryPoint[]> {
    const sym = symbol.toUpperCase()
    const history = MOCK_HISTORY[sym]
    if (!history) {
      throw new FinanceError(sym, 'not_found', `No mock history for symbol "${sym}"`)
    }
    return normalizeHistoryPoints(history)
  },
}

// ---------------------------------------------------------------------------
// Yahoo Finance provider — real network calls.
// Uses dynamic import so the adapter is tree-shaken in test builds.
// ---------------------------------------------------------------------------

async function loadYahooAdapter(): Promise<FinanceProvider> {
  const { yahooProvider } = await import('./yahooAdapter')
  return yahooProvider
}

// ---------------------------------------------------------------------------
// Singleton provider — resolved once on first use.
// In development/production: Yahoo. Override via createFinanceService() in tests.
// ---------------------------------------------------------------------------

let _resolvedProvider: FinanceProvider | null = null

async function getProvider(): Promise<FinanceProvider> {
  if (_resolvedProvider) return _resolvedProvider
  try {
    _resolvedProvider = await loadYahooAdapter()
  } catch {
    console.warn('[financeService] Yahoo adapter unavailable — falling back to mock data.')
    _resolvedProvider = mockProvider
  }
  return _resolvedProvider
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch the current-day quote for a single symbol.
 * Throws FinanceError on failure.
 */
export async function fetchQuote(
  symbol: string,
  provider?: FinanceProvider,
): Promise<Quote> {
  const p = provider ?? (await getProvider())
  const raw = await p.fetchQuote(symbol.toUpperCase())
  return normalizeQuote(raw, symbol.toUpperCase())
}

/**
 * Fetch current quotes for multiple symbols concurrently.
 */
export async function fetchQuotes(
  symbols: string[],
  provider?: FinanceProvider,
): Promise<Quote[]> {
  const p = provider ?? (await getProvider())
  return Promise.all(symbols.map((sym) => fetchQuote(sym, p)))
}

/**
 * Fetch historical close prices for a symbol over the given time window.
 * Throws FinanceError on failure.
 */
export async function fetchHistory(
  symbol: string,
  window: TimeWindow,
  provider?: FinanceProvider,
): Promise<HistoryPoint[]> {
  const p = provider ?? (await getProvider())
  const raw = await p.fetchHistory(symbol.toUpperCase(), window)
  return normalizeHistoryPoints(raw)
}

/**
 * Fetch historical close prices for multiple symbols over the given time window.
 */
export async function fetchMultiHistory(
  symbols: string[],
  window: TimeWindow,
  provider?: FinanceProvider,
): Promise<Record<string, HistoryPoint[]>> {
  const p = provider ?? (await getProvider())
  const entries = await Promise.all(
    symbols.map(async (sym) => {
      const history = await fetchHistory(sym, window, p)
      return [sym.toUpperCase(), history] as const
    }),
  )
  return Object.fromEntries(entries)
}

/**
 * Helper used in tests to pre-pin the provider without touching the singleton.
 * Returns a bound set of service functions using the provided adapter.
 */
export function createFinanceService(provider: FinanceProvider) {
  return {
    fetchQuote: (symbol: string) => fetchQuote(symbol, provider),
    fetchQuotes: (symbols: string[]) => fetchQuotes(symbols, provider),
    fetchHistory: (symbol: string, window: TimeWindow) =>
      fetchHistory(symbol, window, provider),
    fetchMultiHistory: (symbols: string[], window: TimeWindow) =>
      fetchMultiHistory(symbols, window, provider),
  }
}
