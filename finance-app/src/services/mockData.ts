/**
 * mockData.ts
 *
 * Deterministic fixtures used in tests and as an offline fallback.
 * Covers IBM and its key enterprise/cloud competitors.
 */

import type { HistoryPoint, IntradayPoint, Quote } from '../types/finance'

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
// Intraday series (5-minute intervals for the most recent trading session)
// ---------------------------------------------------------------------------

function makeIntraday(
  date: string,
  _open: number,
  points: number[],
): IntradayPoint[] {
  // Market opens at 09:30, each step is 5 minutes
  return points.map((close, i) => {
    const totalMinutes = 9 * 60 + 30 + i * 5
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
    const mm = String(totalMinutes % 60).padStart(2, '0')
    return { date: `${date}T${hh}:${mm}:00`, close }
  })
}

const LAST_TRADING_DATE = '2024-10-07'

export const MOCK_INTRADAY: Record<string, IntradayPoint[]> = {
  IBM: makeIntraday(LAST_TRADING_DATE, 180.1, [
    180.1, 180.5, 180.8, 181.0, 181.3, 181.0, 180.9, 181.2, 181.5, 181.8,
    182.0, 181.9, 182.1, 182.3, 182.0, 181.8, 182.1, 182.3, 182.5, 182.34,
  ]),
  MSFT: makeIntraday(LAST_TRADING_DATE, 415.0, [
    415.0, 416.0, 416.5, 417.0, 417.5, 418.0, 418.5, 419.0, 419.5, 420.0,
    420.2, 420.0, 419.8, 420.1, 420.3, 420.5, 420.3, 420.4, 420.5, 420.55,
  ]),
  NVDA: makeIntraday(LAST_TRADING_DATE, 862.0, [
    862.0, 864.0, 866.0, 867.5, 869.0, 870.5, 871.0, 870.0, 869.5, 871.0,
    872.5, 873.0, 872.0, 873.5, 874.0, 874.5, 874.0, 874.8, 875.0, 875.4,
  ]),
  ORCL: makeIntraday(LAST_TRADING_DATE, 163.0, [
    163.0, 163.5, 164.0, 164.3, 164.5, 164.8, 165.0, 164.8, 164.9, 165.1,
    165.2, 165.0, 165.1, 165.2, 165.1, 165.0, 165.2, 165.3, 165.2, 165.2,
  ]),
  SAP: makeIntraday(LAST_TRADING_DATE, 200.1, [
    200.1, 199.8, 199.5, 199.2, 199.0, 198.8, 198.6, 198.5, 198.7, 198.9,
    199.0, 198.8, 198.7, 198.6, 198.5, 198.7, 198.8, 198.7, 198.7, 198.7,
  ]),
  CRM: makeIntraday(LAST_TRADING_DATE, 268.5, [
    268.5, 269.0, 269.5, 270.0, 270.3, 270.5, 270.8, 271.0, 270.8, 270.5,
    270.6, 270.8, 271.0, 271.2, 271.0, 270.8, 270.9, 271.0, 270.9, 270.88,
  ]),
  GOOGL: makeIntraday(LAST_TRADING_DATE, 166.2, [
    166.2, 166.5, 167.0, 167.3, 167.5, 167.8, 168.0, 168.2, 168.3, 168.4,
    168.5, 168.4, 168.3, 168.4, 168.5, 168.4, 168.4, 168.4, 168.4, 168.42,
  ]),
  AMZN: makeIntraday(LAST_TRADING_DATE, 182.8, [
    182.8, 183.0, 183.5, 184.0, 184.3, 184.5, 184.8, 185.0, 185.1, 185.0,
    184.9, 185.0, 185.1, 185.2, 185.1, 185.0, 185.1, 185.1, 185.1, 185.12,
  ]),
  CSCO: makeIntraday(LAST_TRADING_DATE, 52.1, [
    52.1, 52.2, 52.3, 52.3, 52.4, 52.3, 52.4, 52.4, 52.4, 52.4,
    52.4, 52.4, 52.4, 52.4, 52.4, 52.4, 52.4, 52.4, 52.4, 52.4,
  ]),
  ACN: makeIntraday(LAST_TRADING_DATE, 348.0, [
    348.0, 348.5, 349.0, 349.5, 350.0, 350.1, 350.2, 350.3, 350.2, 350.1,
    350.2, 350.3, 350.2, 350.2, 350.3, 350.2, 350.2, 350.3, 350.2, 350.25,
  ]),
  HPE: makeIntraday(LAST_TRADING_DATE, 18.6, [
    18.6, 18.65, 18.7, 18.75, 18.8, 18.85, 18.9, 18.92, 18.94, 18.95,
    18.95, 18.94, 18.95, 18.95, 18.95, 18.95, 18.95, 18.95, 18.95, 18.95,
  ]),
}
