/**
 * financeService.test.ts
 *
 * Unit tests for the financeService public API using the mock provider.
 * No network calls are made.
 */

import { describe, expect, it } from 'vitest'
import {
  createFinanceService,
  fetchHistory,
  fetchMultiHistory,
  fetchQuote,
  fetchQuotes,
  mockProvider,
} from '../../services/financeService'
import { FinanceError } from '../../types/finance'

const service = createFinanceService(mockProvider)

describe('fetchQuote (mock provider)', () => {
  it('returns a Quote for a known symbol', async () => {
    const quote = await service.fetchQuote('IBM')
    expect(quote.symbol).toBe('IBM')
    expect(quote.price).toBeGreaterThan(0)
    expect(quote.name).toBeTruthy()
  })

  it('is case-insensitive for the symbol', async () => {
    const lower = await service.fetchQuote('ibm')
    const upper = await service.fetchQuote('IBM')
    expect(lower.price).toBe(upper.price)
  })

  it('throws FinanceError for an unknown symbol', async () => {
    await expect(service.fetchQuote('UNKNOWN_XYZ')).rejects.toBeInstanceOf(FinanceError)
  })

  it('throws FinanceError with kind "not_found" for unknown symbol', async () => {
    try {
      await service.fetchQuote('UNKNOWN_XYZ')
    } catch (err) {
      expect(err).toBeInstanceOf(FinanceError)
      expect((err as FinanceError).kind).toBe('not_found')
    }
  })

  it('returns quotes for all five default companies and extended competitors', async () => {
    const symbols = ['IBM', 'MSFT', 'ORCL', 'SAP', 'CRM', 'GOOGL', 'AMZN']
    const quotes = await service.fetchQuotes(symbols)
    expect(quotes).toHaveLength(7)
    symbols.forEach((sym, i) => {
      expect(quotes[i].symbol).toBe(sym)
    })
  })
})

describe('fetchHistory (mock provider)', () => {
  it('returns an array of HistoryPoints for IBM', async () => {
    const history = await service.fetchHistory('IBM', '7d')
    expect(Array.isArray(history)).toBe(true)
    expect(history.length).toBeGreaterThan(0)
    expect(history[0]).toHaveProperty('date')
    expect(history[0]).toHaveProperty('close')
  })

  it('returns 30 days of daily history for month window', async () => {
    const history = await service.fetchHistory('IBM', 'month')
    expect(Array.isArray(history)).toBe(true)
    expect(history).toHaveLength(30)
    expect(history[0]).toHaveProperty('date')
    expect(history[0]).toHaveProperty('close')
  })

  it('throws FinanceError for an unknown symbol', async () => {
    await expect(service.fetchHistory('UNKNOWN_XYZ', '7d')).rejects.toBeInstanceOf(FinanceError)
  })

  it('supports fetchMultiHistory for multiple symbols', async () => {
    const multi = await service.fetchMultiHistory(['IBM', 'MSFT', 'ORCL'], '7d')
    expect(multi.IBM).toBeDefined()
    expect(multi.MSFT).toBeDefined()
    expect(multi.ORCL).toBeDefined()
    expect(multi.IBM.length).toBeGreaterThan(0)
  })

  it('supports fetchMultiHistory for month window', async () => {
    const multi = await service.fetchMultiHistory(['IBM', 'MSFT'], 'month')
    expect(multi.IBM).toHaveLength(30)
    expect(multi.MSFT).toHaveLength(30)
  })
})

describe('Standalone financeService functions with injected provider', () => {
  it('fetchQuote and fetchHistory work when passing provider', async () => {
    const quote = await fetchQuote('IBM', mockProvider)
    expect(quote.symbol).toBe('IBM')

    const quotes = await fetchQuotes(['IBM', 'MSFT'], mockProvider)
    expect(quotes).toHaveLength(2)

    const history = await fetchHistory('IBM', 'quarter', mockProvider)
    expect(history.length).toBeGreaterThan(0)

    const multi = await fetchMultiHistory(['IBM', 'MSFT'], 'quarter', mockProvider)
    expect(multi.IBM).toBeDefined()
    expect(multi.MSFT).toBeDefined()
  })
})
