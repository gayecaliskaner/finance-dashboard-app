/**
 * mockData.ts
 *
 * Deterministic fixtures used in tests and as an offline fallback.
 * Covers IBM and its key enterprise/cloud competitors.
 */

import type { HistoryPoint, Quote } from '../types/finance'

// ---------------------------------------------------------------------------
// Current-day quotes
// ---------------------------------------------------------------------------

export const MOCK_QUOTES: Record<string, Quote> = {
  IBM: {
    symbol: 'IBM',
    name: 'IBM',
    price: 182.34,
    previousClose: 180.1,
    change: 2.24,
    changePercent: 1.24,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 420.55,
    previousClose: 415.0,
    change: 5.55,
    changePercent: 1.34,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  ORCL: {
    symbol: 'ORCL',
    name: 'Oracle',
    price: 165.2,
    previousClose: 163.0,
    change: 2.2,
    changePercent: 1.35,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  SAP: {
    symbol: 'SAP',
    name: 'SAP SE',
    price: 198.7,
    previousClose: 200.1,
    change: -1.4,
    changePercent: -0.7,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  CRM: {
    symbol: 'CRM',
    name: 'Salesforce',
    price: 270.88,
    previousClose: 268.5,
    change: 2.38,
    changePercent: 0.89,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 168.42,
    previousClose: 166.2,
    change: 2.22,
    changePercent: 1.34,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com',
    price: 185.12,
    previousClose: 182.8,
    change: 2.32,
    changePercent: 1.27,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  CSCO: {
    symbol: 'CSCO',
    name: 'Cisco Systems',
    price: 52.4,
    previousClose: 52.1,
    change: 0.3,
    changePercent: 0.58,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  ACN: {
    symbol: 'ACN',
    name: 'Accenture',
    price: 350.25,
    previousClose: 348.0,
    change: 2.25,
    changePercent: 0.65,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  HPE: {
    symbol: 'HPE',
    name: 'Hewlett Packard Enterprise',
    price: 18.95,
    previousClose: 18.6,
    change: 0.35,
    changePercent: 1.88,
    updatedAt: '2024-10-07T15:30:00Z',
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.4,
    previousClose: 862.0,
    change: 13.4,
    changePercent: 1.55,
    updatedAt: '2024-10-07T15:30:00Z',
  },
}

// ---------------------------------------------------------------------------
// Historical series
// ---------------------------------------------------------------------------

const ibmHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 175.0 },
  { date: '2024-09-30', close: 176.5 },
  { date: '2024-10-01', close: 177.2 },
  { date: '2024-10-02', close: 178.9 },
  { date: '2024-10-03', close: 179.4 },
  { date: '2024-10-04', close: 180.1 },
  { date: '2024-10-07', close: 182.34 },
]

const msftHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 410.0 },
  { date: '2024-09-30', close: 411.5 },
  { date: '2024-10-01', close: 413.0 },
  { date: '2024-10-02', close: 414.0 },
  { date: '2024-10-03', close: 415.5 },
  { date: '2024-10-04', close: 415.0 },
  { date: '2024-10-07', close: 420.55 },
]

const orclHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 160.0 },
  { date: '2024-09-30', close: 161.0 },
  { date: '2024-10-01', close: 162.5 },
  { date: '2024-10-02', close: 163.8 },
  { date: '2024-10-03', close: 164.0 },
  { date: '2024-10-04', close: 163.0 },
  { date: '2024-10-07', close: 165.2 },
]

const sapHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 202.0 },
  { date: '2024-09-30', close: 201.5 },
  { date: '2024-10-01', close: 200.8 },
  { date: '2024-10-02', close: 200.0 },
  { date: '2024-10-03', close: 200.5 },
  { date: '2024-10-04', close: 200.1 },
  { date: '2024-10-07', close: 198.7 },
]

const crmHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 265.0 },
  { date: '2024-09-30', close: 266.5 },
  { date: '2024-10-01', close: 267.0 },
  { date: '2024-10-02', close: 268.0 },
  { date: '2024-10-03', close: 269.5 },
  { date: '2024-10-04', close: 268.5 },
  { date: '2024-10-07', close: 270.88 },
]

const googlHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 163.0 },
  { date: '2024-09-30', close: 164.2 },
  { date: '2024-10-01', close: 165.0 },
  { date: '2024-10-02', close: 166.1 },
  { date: '2024-10-03', close: 166.8 },
  { date: '2024-10-04', close: 166.2 },
  { date: '2024-10-07', close: 168.42 },
]

const amznHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 180.0 },
  { date: '2024-09-30', close: 181.5 },
  { date: '2024-10-01', close: 182.0 },
  { date: '2024-10-02', close: 183.4 },
  { date: '2024-10-03', close: 184.0 },
  { date: '2024-10-04', close: 182.8 },
  { date: '2024-10-07', close: 185.12 },
]

const cscoHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 51.0 },
  { date: '2024-09-30', close: 51.4 },
  { date: '2024-10-01', close: 51.8 },
  { date: '2024-10-02', close: 52.0 },
  { date: '2024-10-03', close: 52.2 },
  { date: '2024-10-04', close: 52.1 },
  { date: '2024-10-07', close: 52.4 },
]

const acnHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 342.0 },
  { date: '2024-09-30', close: 344.5 },
  { date: '2024-10-01', close: 346.0 },
  { date: '2024-10-02', close: 347.5 },
  { date: '2024-10-03', close: 348.0 },
  { date: '2024-10-04', close: 348.0 },
  { date: '2024-10-07', close: 350.25 },
]

const hpeHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 18.0 },
  { date: '2024-09-30', close: 18.2 },
  { date: '2024-10-01', close: 18.4 },
  { date: '2024-10-02', close: 18.5 },
  { date: '2024-10-03', close: 18.7 },
  { date: '2024-10-04', close: 18.6 },
  { date: '2024-10-07', close: 18.95 },
]

const nvdaHistory: HistoryPoint[] = [
  { date: '2024-09-27', close: 820.0 },
  { date: '2024-09-30', close: 835.5 },
  { date: '2024-10-01', close: 848.0 },
  { date: '2024-10-02', close: 855.2 },
  { date: '2024-10-03', close: 860.0 },
  { date: '2024-10-04', close: 862.0 },
  { date: '2024-10-07', close: 875.4 },
]

export const MOCK_HISTORY: Record<string, HistoryPoint[]> = {
  IBM: ibmHistory,
  MSFT: msftHistory,
  ORCL: orclHistory,
  SAP: sapHistory,
  CRM: crmHistory,
  GOOGL: googlHistory,
  AMZN: amznHistory,
  CSCO: cscoHistory,
  ACN: acnHistory,
  HPE: hpeHistory,
  NVDA: nvdaHistory,
}

// ---------------------------------------------------------------------------
// 30-day historical series for the Last Month view
// ---------------------------------------------------------------------------

function makeDailySeries(
  startDateStr: string,
  prices: number[],
): HistoryPoint[] {
  const [y, m, d] = startDateStr.split('-').map(Number)
  return prices.map((close, i) => {
    const cur = new Date(y, m - 1, d + i)
    const yyyy = cur.getFullYear()
    const mm = String(cur.getMonth() + 1).padStart(2, '0')
    const dd = String(cur.getDate()).padStart(2, '0')
    return { date: `${yyyy}-${mm}-${dd}`, close }
  })
}

const MONTH_START_DATE = '2024-09-08'

export const MOCK_MONTH_HISTORY: Record<string, HistoryPoint[]> = {
  IBM: makeDailySeries(MONTH_START_DATE, [
    170.2, 170.8, 171.5, 171.0, 172.4, 172.8, 173.1, 172.5, 173.0, 173.8,
    174.2, 174.0, 174.5, 175.2, 174.8, 175.5, 176.0, 175.8, 175.0, 175.0,
    175.5, 176.0, 176.5, 177.2, 178.9, 179.4, 180.1, 181.0, 181.8, 182.34,
  ]),
  MSFT: makeDailySeries(MONTH_START_DATE, [
    402.0, 403.5, 404.2, 405.0, 406.1, 405.8, 406.5, 407.2, 408.0, 407.5,
    408.8, 409.5, 410.2, 409.8, 411.0, 411.5, 412.0, 411.2, 410.0, 410.5,
    411.0, 411.5, 412.0, 413.0, 414.0, 415.5, 415.0, 417.0, 419.0, 420.55,
  ]),
  ORCL: makeDailySeries(MONTH_START_DATE, [
    150.0, 151.2, 152.0, 153.1, 153.8, 154.2, 154.0, 155.1, 155.8, 156.2,
    157.0, 156.5, 157.2, 158.0, 158.5, 159.0, 159.8, 159.2, 160.0, 160.2,
    160.8, 161.0, 161.5, 162.5, 163.8, 164.0, 163.0, 164.2, 164.8, 165.2,
  ]),
  SAP: makeDailySeries(MONTH_START_DATE, [
    192.0, 192.8, 193.5, 194.0, 194.8, 195.2, 196.0, 196.5, 197.0, 197.8,
    198.2, 198.5, 199.0, 199.5, 200.0, 200.8, 201.2, 201.5, 202.0, 202.2,
    201.8, 201.5, 201.0, 200.8, 200.0, 200.5, 200.1, 199.5, 199.0, 198.7,
  ]),
  CRM: makeDailySeries(MONTH_START_DATE, [
    255.0, 256.2, 257.0, 258.1, 258.8, 259.5, 260.0, 260.8, 261.5, 262.0,
    262.8, 263.2, 264.0, 264.5, 265.0, 265.8, 266.2, 265.5, 265.0, 265.5,
    266.0, 266.5, 267.0, 267.0, 268.0, 269.5, 268.5, 269.8, 270.2, 270.88,
  ]),
  GOOGL: makeDailySeries(MONTH_START_DATE, [
    156.0, 156.8, 157.5, 158.0, 158.9, 159.2, 160.0, 160.5, 161.2, 161.8,
    162.0, 161.8, 162.5, 163.0, 163.8, 164.0, 164.5, 163.8, 163.0, 163.5,
    164.0, 164.2, 164.8, 165.0, 166.1, 166.8, 166.2, 167.0, 167.8, 168.42,
  ]),
  AMZN: makeDailySeries(MONTH_START_DATE, [
    172.0, 172.8, 173.5, 174.2, 175.0, 175.8, 176.2, 176.9, 177.5, 178.0,
    178.8, 179.2, 180.0, 179.8, 180.5, 181.0, 181.8, 180.5, 180.0, 180.8,
    181.2, 181.5, 181.8, 182.0, 183.4, 184.0, 182.8, 183.9, 184.5, 185.12,
  ]),
  CSCO: makeDailySeries(MONTH_START_DATE, [
    48.5, 48.8, 49.0, 49.2, 49.5, 49.8, 50.0, 50.2, 50.5, 50.8,
    51.0, 51.1, 51.2, 51.3, 51.4, 51.5, 51.6, 51.2, 51.0, 51.2,
    51.3, 51.4, 51.6, 51.8, 52.0, 52.2, 52.1, 52.2, 52.3, 52.4,
  ]),
  ACN: makeDailySeries(MONTH_START_DATE, [
    330.0, 331.5, 333.0, 334.2, 335.0, 336.1, 337.0, 338.2, 339.0, 340.1,
    341.0, 341.5, 342.0, 343.1, 343.8, 344.5, 345.0, 343.5, 342.0, 343.0,
    344.0, 344.5, 345.2, 346.0, 347.5, 348.0, 348.0, 349.0, 349.8, 350.25,
  ]),
  HPE: makeDailySeries(MONTH_START_DATE, [
    17.0, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9,
    18.0, 18.1, 18.15, 18.2, 18.25, 18.3, 18.35, 18.1, 18.0, 18.1,
    18.15, 18.2, 18.3, 18.4, 18.5, 18.7, 18.6, 18.75, 18.85, 18.95,
  ]),
  NVDA: makeDailySeries(MONTH_START_DATE, [
    780.0, 785.0, 792.0, 800.0, 808.0, 812.0, 818.0, 822.0, 828.0, 832.0,
    838.0, 842.0, 845.0, 840.0, 846.0, 850.0, 855.0, 835.0, 820.0, 828.0,
    832.0, 835.5, 840.0, 848.0, 855.2, 860.0, 862.0, 868.0, 872.0, 875.4,
  ]),
}
