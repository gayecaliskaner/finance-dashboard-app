/**
 * useQuotes.ts
 *
 * Fetches current-day quotes for a list of symbols using SWR.
 * Returns a map of symbol → { quote, isLoading, error }.
 * Supports any number of companies dynamically without fixed-slot restrictions.
 */

import useSWR from 'swr'
import { fetchQuote } from '../services/financeService'
import type { FinanceProvider } from '../services/financeService'
import type { Quote } from '../types/finance'
import { FinanceError } from '../types/finance'

export interface QuoteState {
  quote: Quote | undefined
  isLoading: boolean
  error: FinanceError | Error | undefined
}

/**
 * Fetch a single symbol's current quote.
 * Pass a `provider` to override the default adapter (useful in Storybook / tests).
 */
export function useQuote(symbol: string, provider?: FinanceProvider): QuoteState {
  const key = symbol ? `quote/${symbol.toUpperCase()}` : null
  const { data, error, isLoading } = useSWR<Quote, FinanceError | Error>(
    key,
    () => fetchQuote(symbol, provider),
    {
      refreshInterval: 60_000, // re-fetch every minute
      revalidateOnFocus: true,
    },
  )

  return { quote: data, isLoading, error }
}

/**
 * Fetch quotes for multiple symbols.
 * Returns a stable map — symbols with errors appear with `error` set.
 * Fully dynamic for any number of symbols.
 */
export function useQuotes(
  symbols: string[],
  provider?: FinanceProvider,
): Record<string, QuoteState> {
  const normalizedSymbols = Array.from(
    new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean)),
  )
  const cacheKey =
    normalizedSymbols.length > 0
      ? `quotes/${normalizedSymbols.sort().join(',')}`
      : null

  const { data, error, isLoading } = useSWR<
    Record<string, QuoteState>,
    FinanceError | Error
  >(
    cacheKey,
    async () => {
      const results = await Promise.allSettled(
        normalizedSymbols.map((sym) => fetchQuote(sym, provider)),
      )

      const map: Record<string, QuoteState> = {}
      normalizedSymbols.forEach((sym, i) => {
        const res = results[i]
        if (res.status === 'fulfilled') {
          map[sym] = {
            quote: res.value,
            isLoading: false,
            error: undefined,
          }
        } else {
          map[sym] = {
            quote: undefined,
            isLoading: false,
            error:
              res.reason instanceof Error
                ? res.reason
                : new FinanceError(sym, 'network', String(res.reason)),
          }
        }
      })
      return map
    },
    {
      refreshInterval: 60_000,
      revalidateOnFocus: true,
    },
  )

  const output: Record<string, QuoteState> = {}
  for (const sym of normalizedSymbols) {
    if (data && data[sym]) {
      output[sym] = data[sym]
    } else {
      output[sym] = {
        quote: undefined,
        isLoading,
        error: error ?? undefined,
      }
    }
  }

  return output
}
