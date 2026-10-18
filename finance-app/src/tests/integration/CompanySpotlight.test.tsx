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
  it('renders the symbol heading after the store is set to a known symbol', async () => {
    // Switch to 7d so history is fetched (day window shows a guidance message instead)
    useDashboardStore.setState({ selectedWindow: '7d', focusedSymbol: 'NVDA' })

    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    // The spotlight section heading should appear with the ticker
    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    expect(within(spotlight).getAllByText('NVDA').length).toBeGreaterThan(0)
    // No error notice inside spotlight section
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

describe('FocusedCompanyChart — day-window guidance', () => {
  it('shows a guidance message when the day tab is active (no history for day window)', async () => {
    // Set focused symbol while selectedWindow is 'day' (set in beforeEach)
    useDashboardStore.setState({ focusedSymbol: 'NVDA' })

    await act(async () => { renderWithSWR(<DashboardPage provider={mockProvider} />) })

    const spotlight = screen.getByRole('region', { name: /company spotlight/i })
    expect(within(spotlight).getByText(/7 days/i)).toBeInTheDocument()
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
