/**
 * useHistory.ts
 *
 * Fetches historical price series for a single symbol and time window.
 * The SWR cache key changes when the window changes, triggering a re-fetch.
 * Also provides useMultiHistory for fetching multiple companies dynamically.
 */

import useSWR from 'swr'
import { fetchHistory } from '../services/financeService'
import type { FinanceProvider } from '../services/financeService'
import type { HistoryPoint, TimeWindow } from '../types/finance'
import { FinanceError } from '../types/finance'

export interface HistoryState {
  history: HistoryPoint[] | undefined
  isLoading: boolean
  error: FinanceError | Error | undefined
}

export function useHistory(
  symbol: string,
  window: TimeWindow,
  provider?: FinanceProvider,
): HistoryState {
  const sym = symbol ? symbol.toUpperCase() : ''
  // Always fetch for all windows — intraday data is served for 'day' window
  const key = sym ? `history/${sym}/${window}` : null
  const { data, error, isLoading } = useSWR<HistoryPoint[], FinanceError | Error>(
    key,
    () => fetchHistory(sym, window, provider),
    {
      revalidateOnFocus: false, // historical data does not change on focus
    },
  )

  return { history: data, isLoading, error }
}

/**
 * Fetch historical data for multiple symbols dynamically.
 * Works with any number of symbols without fixed slot limitations.
 */
export function useMultiHistory(
  symbols: string[],
  window: TimeWindow,
  provider?: FinanceProvider,
): Record<string, HistoryState> {
  const normalizedSymbols = Array.from(
    new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean)),
  )
  const cacheKey =
    normalizedSymbols.length > 0 && window !== 'day'
      ? `multi-history/${normalizedSymbols.sort().join(',')}/${window}`
      : null

  const { data, error, isLoading } = useSWR<
    Record<string, HistoryState>,
    FinanceError | Error
  >(
    cacheKey,
    async () => {
      const results = await Promise.allSettled(
        normalizedSymbols.map((sym) => fetchHistory(sym, window, provider)),
      )

      const map: Record<string, HistoryState> = {}
      normalizedSymbols.forEach((sym, i) => {
        const res = results[i]
        if (res.status === 'fulfilled') {
          map[sym] = {
            history: res.value,
            isLoading: false,
            error: undefined,
          }
        } else {
          map[sym] = {
            history: undefined,
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
      revalidateOnFocus: false,
    },
  )

  const output: Record<string, HistoryState> = {}
  for (const sym of normalizedSymbols) {
    if (data && data[sym]) {
      output[sym] = data[sym]
    } else {
      output[sym] = {
        history: undefined,
        isLoading: window !== 'day' && isLoading,
        error: error ?? undefined,
      }
    }
  }

  return output
}
