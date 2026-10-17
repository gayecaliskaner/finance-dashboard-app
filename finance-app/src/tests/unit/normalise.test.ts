/**
 * normalise.test.ts
 *
 * Unit tests for the normalisation utilities, quote normalisation,
 * history normalization, and base-100 rebasing utilities.
 */

import { describe, expect, it } from 'vitest'
import {
  calculatePeriodStats,
  mergeNormalisedSeries,
  normalizeHistoryPoints,
  normalizeQuote,
  rebaseTo100,
  toISODate,
} from '../../utils/normalise'
import type { HistoryPoint, HistorySeries } from '../../types/finance'
import { FinanceError } from '../../types/finance'

// ---------------------------------------------------------------------------
// toISODate
// ---------------------------------------------------------------------------

describe('toISODate', () => {
  it('formats Date object to YYYY-MM-DD', () => {
    const d = new Date('2024-10-15T12:00:00Z')
    expect(toISODate(d)).toBe('2024-10-15')
  })

  it('formats epoch in seconds to YYYY-MM-DD', () => {
    // 1728316800 is 2024-10-07T16:00:00.000Z
    const timestampSec = 1728316800
    expect(toISODate(timestampSec)).toBe('2024-10-07')
  })

  it('formats ISO string date', () => {
    expect(toISODate('2024-10-07T15:30:00Z')).toBe('2024-10-07')
    expect(toISODate('2024-10-07')).toBe('2024-10-07')
  })
})

// ---------------------------------------------------------------------------
// normalizeQuote
// ---------------------------------------------------------------------------

describe('normalizeQuote', () => {
  it('normalizes raw Yahoo quote response correctly', () => {
    const raw = {
      symbol: 'ibm',
      shortName: 'International Business Machines',
      regularMarketPrice: 182.34,
      regularMarketPreviousClose: 180.1,
      regularMarketChange: 2.24,
      regularMarketChangePercent: 0.0124, // decimal from Yahoo
    }

    const quote = normalizeQuote(raw)
    expect(quote.symbol).toBe('IBM')
    expect(quote.name).toBe('International Business Machines')
    expect(quote.price).toBe(182.34)
    expect(quote.previousClose).toBe(180.1)
    expect(quote.change).toBe(2.24)
    expect(quote.changePercent).toBe(1.24)
    expect(quote.updatedAt).toBeTruthy()
  })

  it('handles already-percentage formatted changePercent', () => {
    const raw = {
      symbol: 'MSFT',
      name: 'Microsoft',
      price: 420.0,
      previousClose: 400.0,
      changePercent: 5.0,
    }

    const quote = normalizeQuote(raw)
    expect(quote.changePercent).toBe(5.0)
    expect(quote.change).toBe(20.0)
  })

  it('falls back to symbol if name is missing', () => {
    const raw = {
      symbol: 'ORCL',
      price: 150,
    }

    const quote = normalizeQuote(raw)
    expect(quote.name).toBe('ORCL')
  })
})

// ---------------------------------------------------------------------------
// normalizeHistoryPoints
// ---------------------------------------------------------------------------

describe('normalizeHistoryPoints', () => {
  it('handles empty or non-array inputs', () => {
    expect(normalizeHistoryPoints(null as any)).toEqual([])
    expect(normalizeHistoryPoints([])).toEqual([])
  })

  it('filters out points with null or undefined close prices', () => {
    const raw = [
      { date: '2024-10-01', close: 100 },
      { date: '2024-10-02', close: null },
      { date: '2024-10-03', close: 105 },
    ]
    const res = normalizeHistoryPoints(raw)
    expect(res).toHaveLength(2)
    expect(res.map((r) => r.close)).toEqual([100, 105])
  })

  it('sorts points chronologically and deduplicates by date', () => {
    const raw = [
      { date: '2024-10-03', close: 105 },
      { date: '2024-10-01', close: 100 },
      { date: '2024-10-02', close: 102 },
      { date: '2024-10-02', close: 103 }, // duplicate date
    ]
    const res = normalizeHistoryPoints(raw)
    expect(res).toHaveLength(3)
    expect(res[0].date).toBe('2024-10-01')
    expect(res[1].date).toBe('2024-10-02')
    expect(res[2].date).toBe('2024-10-03')
  })
})

// ---------------------------------------------------------------------------
// rebaseTo100
// ---------------------------------------------------------------------------

describe('rebaseTo100', () => {
  it('returns an empty array when given an empty array', () => {
    expect(rebaseTo100([])).toEqual([])
  })

  it('sets the first point to exactly 100', () => {
    const input: HistoryPoint[] = [
      { date: '2024-10-01', close: 200 },
      { date: '2024-10-02', close: 210 },
    ]
    const result = rebaseTo100(input)
    expect(result[0].close).toBe(100)
  })

  it('correctly calculates relative values', () => {
    const input: HistoryPoint[] = [
      { date: '2024-10-01', close: 100 },
      { date: '2024-10-02', close: 110 },
      { date: '2024-10-03', close: 90 },
    ]
    const result = rebaseTo100(input)
    expect(result[0].close).toBe(100)
    expect(result[1].close).toBe(110)
    expect(result[2].close).toBe(90)
  })

  it('preserves the original date strings', () => {
    const input: HistoryPoint[] = [
      { date: '2024-10-07', close: 182 },
      { date: '2024-10-08', close: 184 },
    ]
    const result = rebaseTo100(input)
    expect(result[0].date).toBe('2024-10-07')
    expect(result[1].date).toBe('2024-10-08')
  })

  it('handles a single-point series', () => {
    const input: HistoryPoint[] = [{ date: '2024-10-01', close: 500 }]
    const result = rebaseTo100(input)
    expect(result).toHaveLength(1)
    expect(result[0].close).toBe(100)
  })
})

// ---------------------------------------------------------------------------
// mergeNormalisedSeries
// ---------------------------------------------------------------------------

describe('mergeNormalisedSeries', () => {
  it('returns an empty array when given an empty series array', () => {
    expect(mergeNormalisedSeries([])).toEqual([])
  })

  it('merges two series into date-keyed rows', () => {
    const series: HistorySeries[] = [
      {
        symbol: 'IBM',
        name: 'IBM',
        color: '#1f70c1',
        data: [
          { date: '2024-10-01', close: 180 },
          { date: '2024-10-02', close: 189 },
        ],
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        color: '#7c5cd8',
        data: [
          { date: '2024-10-01', close: 400 },
          { date: '2024-10-02', close: 420 },
        ],
      },
    ]

    const merged = mergeNormalisedSeries(series)
    expect(merged).toHaveLength(2)
    // Both start at 100
    expect(merged[0].IBM).toBe(100)
    expect(merged[0].MSFT).toBe(100)
    // IBM gained 5%, MSFT gained 5%
    expect(merged[1].IBM).toBe(105)
    expect(merged[1].MSFT).toBe(105)
  })

  it('includes date in each merged row', () => {
    const series: HistorySeries[] = [
      {
        symbol: 'IBM',
        name: 'IBM',
        color: '#000',
        data: [{ date: '2024-10-01', close: 100 }],
      },
    ]
    const merged = mergeNormalisedSeries(series)
    expect(merged[0].date).toBe('2024-10-01')
  })
})

// ---------------------------------------------------------------------------
// calculatePeriodStats
// ---------------------------------------------------------------------------

describe('calculatePeriodStats', () => {
  it('returns null for empty series', () => {
    expect(calculatePeriodStats([])).toBeNull()
  })

  it('calculates min, max, change, and changePercent correctly', () => {
    const points: HistoryPoint[] = [
      { date: '2024-07-01', close: 150 },
      { date: '2024-08-01', close: 140 }, // min
      { date: '2024-09-01', close: 180 }, // max
      { date: '2024-10-01', close: 165 }, // end
    ]

    const stats = calculatePeriodStats(points)
    expect(stats).not.toBeNull()
    expect(stats?.start).toBe(150)
    expect(stats?.end).toBe(165)
    expect(stats?.min).toBe(140)
    expect(stats?.max).toBe(180)
    expect(stats?.change).toBe(15)
    expect(stats?.changePercent).toBe(10)
  })
})

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

describe('normalizeQuote — validation', () => {
  it('throws a FinanceError (kind "parse") when the price is not numeric', () => {
    expect(() => normalizeQuote({ symbol: 'ibm', price: 'abc' })).toThrow(FinanceError)
    try {
      normalizeQuote({ symbol: 'ibm', price: 'abc' })
    } catch (err) {
      expect((err as FinanceError).kind).toBe('parse')
      expect((err as FinanceError).symbol).toBe('IBM')
    }
  })

  it('throws when the price is Infinity', () => {
    expect(() => normalizeQuote({ symbol: 'IBM', price: Infinity })).toThrow(FinanceError)
  })

  it('derives change and percent from previousClose when not supplied', () => {
    const q = normalizeQuote({ symbol: 'ibm', price: 110, previousClose: 100 })
    expect(q.symbol).toBe('IBM')
    expect(q.change).toBe(10)
    expect(q.changePercent).toBe(10)
  })

  it('reports 0% change when previousClose is 0', () => {
    const q = normalizeQuote({ symbol: 'IBM', price: 10, previousClose: 0, change: 10 })
    expect(q.changePercent).toBe(0)
  })
})

describe('normalizeHistoryPoints — validation', () => {
  it('drops non-finite, non-numeric, and non-object entries', () => {
    const result = normalizeHistoryPoints([
      { date: '2024-01-01', close: Infinity },
      { date: '2024-01-02', close: 'abc' },
      null,
      'string',
      { date: '2024-01-03', close: 5 },
    ])
    expect(result).toEqual([{ date: '2024-01-03', close: 5 }])
  })

  it('falls back to adjclose and price fields', () => {
    const result = normalizeHistoryPoints([
      { date: '2024-01-01', adjclose: 10 },
      { date: '2024-01-02', price: 11 },
    ])
    expect(result.map((p) => p.close)).toEqual([10, 11])
  })
})

describe('calculatePeriodStats — edge cases', () => {
  it('returns 0% change when the start value is 0', () => {
    const stats = calculatePeriodStats([
      { date: '2024-01-01', close: 0 },
      { date: '2024-01-02', close: 5 },
    ])
    expect(stats?.changePercent).toBe(0)
    expect(stats?.change).toBe(5)
  })
})
