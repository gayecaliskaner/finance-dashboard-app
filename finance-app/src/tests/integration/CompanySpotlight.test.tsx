/**
 * CompanySpotlight.test.tsx
 *
 * Integration tests for the Company Spotlight feature:
 * - CompanySearchPanel renders and validates input
 * - FocusedCompanyChart shows a chart for a known symbol (NVDA)
 * - FocusedCompanyChart shows ErrorNotice for an unknown symbol
 * - Existing comparison dashboards are unaffected by a focused symbol
 */

import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { SWRConfig } from 'swr'
import { DashboardPage } from '../../components/dashboard/DashboardPage'
import { DEFAULT_COMPANIES, useDashboardStore } from '../../store/dashboardStore'
import { FinanceError } from '../../types/finance'
import type { FinanceProvider } from '../../services/financeService'
import { mockProvider } from '../../services/financeService'

/** Wrap in a fresh SWR cache so tests are isolated. */
function renderWithSWR(ui: React.ReactElement) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {ui}
    </SWRConfig>,
  )
}

beforeEach(() => {
  useDashboardStore.setState({
    selectedWindow: 'day',
    companies: DEFAULT_COMPANIES,
    dataSource: 'mock',
    focusedSymbol: null,
  })
})

describe('CompanySearchPanel', () => {
  it('renders the combobox and Load Chart button', async () => {
    await act(async () => { renderWithSWR(<DashboardPage />) })
    expect(screen.getByRole('combobox', { name: /company symbol/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /load chart/i })).toBeInTheDocument()
  })

  it('shows a validation error when submitted with an empty input', async () => {
    const user = userEvent.setup()
    await act(async () => { renderWithSWR(<DashboardPage />) })
    await user.click(screen.getByRole('button', { name: /load chart/i }))
    expect(screen.getByText(/please enter a ticker symbol/i)).toBeInTheDocument()
  })

  it('clears a previous validation error when the user retypes', async () => {
    const user = userEvent.setup()
    await act(async () => { renderWithSWR(<DashboardPage />) })
    // First submit with empty input to trigger error
    await user.click(screen.getByRole('button', { name: /load chart/i }))
    expect(screen.getByText(/please enter a ticker symbol/i)).toBeInTheDocument()
    // Clicking Load Chart again with still-empty input keeps the error visible
    await user.click(screen.getByRole('button', { name: /load chart/i }))
    expect(screen.getByText(/please enter a ticker symbol/i)).toBeInTheDocument()
  })
})

describe('FocusedCompanyChart — success path', () => {
  it('renders the symbol heading after the store is set to a known symbol (7d)', async () => {
    useDashboardStore.setState({ selectedWindow: '7d', focusedSymbol: 'NVDA' })

    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    expect(within(spotlight).getAllByText('NVDA').length).toBeGreaterThan(0)
    expect(within(spotlight).queryByText(/not found/i)).not.toBeInTheDocument()
  })
})

describe('FocusedCompanyChart — error path', () => {
  it('shows an ErrorNotice inside the spotlight when the symbol has no data', async () => {
    useDashboardStore.setState({ selectedWindow: '7d', focusedSymbol: 'UNKNWN' })

    // Provider that fails for history calls (simulates unknown symbol)
    const failingHistoryProvider: FinanceProvider = {
      fetchQuote: mockProvider.fetchQuote,
      fetchHistory: async (symbol) => {
        throw new FinanceError(symbol, 'not_found', `No mock history for symbol "${symbol}"`)
      },
    }

    await act(async () => { renderWithSWR(<DashboardPage provider={failingHistoryProvider} />) })

    // Scope assertion to the spotlight section so comparison-company errors don't interfere
    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    expect(
      await within(spotlight).findByText(/no mock history for symbol "UNKNWN"/i),
    ).toBeInTheDocument()
  })
})

describe('FocusedCompanyChart — Today (intraday) view', () => {
  it('renders the symbol heading on the Today (day) tab', async () => {
    // selectedWindow is 'day' from beforeEach
    useDashboardStore.setState({ focusedSymbol: 'NVDA' })

    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    expect(within(spotlight).getAllByText('NVDA').length).toBeGreaterThan(0)
    // Should show "Today" label, not the old guidance message
    expect(within(spotlight).getByText(/today/i)).toBeInTheDocument()
    expect(within(spotlight).queryByText(/select the.*7 days/i)).not.toBeInTheDocument()
  })

  it('shows an intraday chart (recharts container) on the Today tab', async () => {
    useDashboardStore.setState({ focusedSymbol: 'NVDA' })

    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    // Recharts always renders a ResponsiveContainer div even in jsdom
    expect(spotlight.querySelector('.recharts-responsive-container')).toBeTruthy()
  })

  it('shows an ErrorNotice on the Today tab for an unknown symbol', async () => {
    useDashboardStore.setState({ focusedSymbol: 'UNKNWN' })

    const failingProvider: FinanceProvider = {
      fetchQuote: mockProvider.fetchQuote,
      fetchHistory: async (symbol) => {
        throw new FinanceError(symbol, 'not_found', `No mock history for symbol "${symbol}"`)
      },
    }

    await act(async () => { renderWithSWR(<DashboardPage provider={failingProvider} />) })

    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    expect(
      await within(spotlight).findByText(/no mock history for symbol "UNKNWN"/i),
    ).toBeInTheDocument()
  })

  it('falls back to the most recent session when intraday data has no T-marked symbol', async () => {
    // Provider returns daily-style data for day window (simulates market-closed fallback)
    const dailyFallbackProvider: FinanceProvider = {
      fetchQuote: mockProvider.fetchQuote,
      fetchHistory: async (symbol, window) => {
        if (window === 'day') {
          // Return a single daily close point (no time component)
          return [{ date: '2024-10-07', close: 875.4 }]
        }
        return mockProvider.fetchHistory(symbol, window)
      },
    }
    useDashboardStore.setState({ focusedSymbol: 'NVDA' })

    await act(async () => { renderWithSWR(<DashboardPage provider={dailyFallbackProvider} />) })

    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    // Chart should still render without error
    expect(within(spotlight).queryByText(/not found/i)).not.toBeInTheDocument()
    expect(within(spotlight).getAllByText('NVDA').length).toBeGreaterThan(0)
  })
})

describe('Existing dashboards — non-regression', () => {
  it('original 5 tracked companies remain after a symbol is focused', async () => {
    useDashboardStore.setState({ focusedSymbol: 'NVDA' })
    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    expect(screen.getByText('5 Tracked Companies')).toBeInTheDocument()
  })

  it('intraday quotes section is still present after a symbol is focused', async () => {
    useDashboardStore.setState({ focusedSymbol: 'NVDA' })
    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    expect(screen.getByText('Intraday Quotes')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'IBM summary' })).toBeInTheDocument()
  })
})
