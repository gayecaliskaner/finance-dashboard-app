/**
 * yahooAdapter.test.ts
 *
 * Unit tests for the yahooProvider adapter and normalization of Yahoo Finance payloads.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { yahooProvider } from '../../services/yahooAdapter'

const mockQuoteSummary = vi.fn()
const mockChart = vi.fn()

vi.mock('yahoo-finance2', () => ({
  default: {
    quoteSummary: (...args: any[]) => mockQuoteSummary(...args),
    chart: (...args: any[]) => mockChart(...args),
  },
}))

describe('yahooAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successfully fetches and normalizes quote from yahoo-finance2 mock', async () => {
    mockQuoteSummary.mockResolvedValueOnce({
      price: {
        shortName: 'International Business Machines',
        regularMarketPrice: 182.5,
        regularMarketPreviousClose: 180.0,
        regularMarketChange: 2.5,
        regularMarketChangePercent: 0.01388,
      },
    })

    const quote = await yahooProvider.fetchQuote('IBM')
    expect(quote.symbol).toBe('IBM')
    expect(quote.name).toBe('International Business Machines')
    expect(quote.price).toBe(182.5)
    expect(quote.previousClose).toBe(180)
    expect(quote.change).toBe(2.5)
    expect(quote.changePercent).toBe(1.39)
  })

  it('throws FinanceError with kind "parse" when price is missing', async () => {
    mockQuoteSummary.mockResolvedValueOnce({ price: null })

    await expect(yahooProvider.fetchQuote('INVALID')).rejects.toMatchObject({
      name: 'FinanceError',
      kind: 'parse',
    })
  })

  it('fetches and normalizes chart history points', async () => {
    mockChart.mockResolvedValueOnce({
      quotes: [
        { date: '2024-10-01', close: 180.0 },
        { date: '2024-10-02', close: 182.5 },
      ],
    })

    const history = await yahooProvider.fetchHistory('IBM', '7d')
    expect(history).toHaveLength(2)
    expect(history[0]).toEqual({ date: '2024-10-01', close: 180.0 })
    expect(history[1]).toEqual({ date: '2024-10-02', close: 182.5 })
  })

  it('handles not found 404 errors as kind "not_found"', async () => {
    mockQuoteSummary.mockRejectedValueOnce(new Error('404 Not Found'))
    mockChart.mockRejectedValueOnce(new Error('404 Not Found'))

    await expect(yahooProvider.fetchQuote('NONEXISTENT')).rejects.toMatchObject({
      name: 'FinanceError',
      kind: 'not_found',
    })

    await expect(yahooProvider.fetchHistory('NONEXISTENT', 'quarter')).rejects.toMatchObject({
      name: 'FinanceError',
      kind: 'not_found',
    })
  })
})
