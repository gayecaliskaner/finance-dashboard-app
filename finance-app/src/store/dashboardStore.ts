/**
 * dashboardStore.ts
 *
 * Zustand store for synchronous UI state.
 * - selectedWindow: which time-window tab is active ('day' | '7d' | 'quarter')
 * - companies: the list of companies shown in the dashboard
 * - dataSource: 'live' (real Yahoo Finance market data) or 'mock' (offline fixture data)
 *
 * Designed to be easily extensible so companies can be dynamically added,
 * removed, or customized.
 */

import { create } from 'zustand'
import type { Company, TimeWindow } from '../types/finance'

// ---------------------------------------------------------------------------
// Default companies — IBM + primary enterprise/cloud competitors
// ---------------------------------------------------------------------------

export const DEFAULT_COMPANIES: Company[] = [
  { symbol: 'IBM',  name: 'IBM',        color: '#1f70c1' },
  { symbol: 'MSFT', name: 'Microsoft',  color: '#7c5cd8' },
  { symbol: 'ORCL', name: 'Oracle',     color: '#e05c2a' },
  { symbol: 'SAP',  name: 'SAP SE',     color: '#00a65a' },
  { symbol: 'CRM',  name: 'Salesforce', color: '#009edb' },
]

// ---------------------------------------------------------------------------
// Extended catalog of competitors for easy selection & extension
// ---------------------------------------------------------------------------

export const COMPETITOR_CATALOG: Company[] = [
  ...DEFAULT_COMPANIES,
  { symbol: 'GOOGL', name: 'Alphabet',  color: '#ea4335' },
  { symbol: 'AMZN',  name: 'Amazon',    color: '#ff9900' },
  { symbol: 'CSCO',  name: 'Cisco',     color: '#1ba0d7' },
  { symbol: 'ACN',   name: 'Accenture', color: '#a100ff' },
  { symbol: 'HPE',   name: 'HP Enterp.',color: '#01a982' },
]

const PALETTE = [
  '#1f70c1', '#7c5cd8', '#e05c2a', '#00a65a', '#009edb',
  '#ea4335', '#ff9900', '#1ba0d7', '#a100ff', '#01a982',
  '#d97706', '#059669', '#dc2626', '#2563eb', '#9333ea',
]

export function getCompanyColor(index: number): string {
  return PALETTE[index % PALETTE.length]
}

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

export type DataSource = 'live' | 'mock'

const isTestEnv =
  ((globalThis as any).process?.env?.NODE_ENV === 'test') ||
  (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test')

interface DashboardState {
  selectedWindow: TimeWindow
  companies: Company[]
  dataSource: DataSource
  setWindow: (window: TimeWindow) => void
  setCompanies: (companies: Company[]) => void
  setDataSource: (source: DataSource) => void
  addCompany: (company: Company) => void
  removeCompany: (symbol: string) => void
  resetCompanies: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedWindow: 'day',
  companies: DEFAULT_COMPANIES,
  dataSource: isTestEnv ? 'mock' : 'live',
  setWindow: (window) => set({ selectedWindow: window }),
  setCompanies: (companies) => set({ companies }),
  setDataSource: (dataSource) => set({ dataSource }),
  addCompany: (company) =>
    set((state) => {
      const upper = company.symbol.toUpperCase()
      if (state.companies.some((c) => c.symbol.toUpperCase() === upper)) {
        return state
      }
      return {
        companies: [
          ...state.companies,
          {
            ...company,
            symbol: upper,
            color: company.color || getCompanyColor(state.companies.length),
          },
        ],
      }
    }),
  removeCompany: (symbol) =>
    set((state) => ({
      companies: state.companies.filter(
        (c) => c.symbol.toUpperCase() !== symbol.toUpperCase(),
      ),
    })),
  resetCompanies: () => set({ companies: DEFAULT_COMPANIES }),
}))
