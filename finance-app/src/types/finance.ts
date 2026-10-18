/** The three time-window views the dashboard supports. */
export type TimeWindow = 'day' | '7d' | 'quarter'

/** A single company that appears in the dashboard. */
export interface Company {
  symbol: string
  name: string
  /** Hex colour token used consistently across all charts. */
  color: string
}

/** Normalised snapshot of a stock's current-day data. */
export interface Quote {
  symbol: string
  name: string
  price: number
  previousClose: number
  change: number
  changePercent: number
  /** ISO date-time string of the last update. */
  updatedAt: string
}

/** A single point in a historical price series. */
export interface HistoryPoint {
  /** ISO date string, e.g. "2024-10-07". */
  date: string
  close: number
}

/**
 * A single intraday price point.
 * `date` is a full ISO datetime string, e.g. "2024-10-07T09:30:00".
 */
export interface IntradayPoint {
  /** Full ISO datetime string, e.g. "2024-10-07T09:30:00". */
  date: string
  close: number
}

/** A labelled series of history points used in comparison charts. */
export interface HistorySeries {
  symbol: string
  name: string
  color: string
  data: HistoryPoint[]
}

/** Typed error thrown by the data service layer. */
export class FinanceError extends Error {
  symbol: string
  kind: 'not_found' | 'network' | 'parse'

  constructor(
    symbol: string,
    kind: 'not_found' | 'network' | 'parse',
    message: string,
  ) {
    super(message)
    this.name = 'FinanceError'
    this.symbol = symbol
    this.kind = kind
  }
}
