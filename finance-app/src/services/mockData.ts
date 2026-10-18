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
