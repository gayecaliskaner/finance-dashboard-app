/**
 * UiRendering.test.tsx
 *
 * Additional UI rendering paths:
 * - RankingTable default ordering and click-to-sort behaviour
 * - ErrorNotice rendering
 * - DashboardPage error path when the data provider fails
 * - Data-source toggle label
 */

import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { SWRConfig } from 'swr'
import { DashboardPage } from '../../components/dashboard/DashboardPage'
import { ErrorNotice } from '../../components/dashboard/ErrorNotice'
import { RankingTable } from '../../components/cards/RankingTable'
import type { FinanceProvider } from '../../services/financeService'
import { DEFAULT_COMPANIES, useDashboardStore } from '../../store/dashboardStore'
import { FinanceError } from '../../types/finance'
import type { Quote } from '../../types/finance'

const quote = (symbol: string, name: string, price: number, changePercent: number): Quote => ({
  symbol,
  name,
  price,
  previousClose: price,
  change: changePercent,
  changePercent,
  updatedAt: '2024-10-07T15:30:00Z',
})

const QUOTES: Quote[] = [
  quote('AAA', 'Alpha', 100, 1),
  quote('BBB', 'Beta', 300, 3),
  quote('CCC', 'Gamma', 200, -2),
]

/** Returns the ticker symbols in table-body row order. */
function rowSymbols(): string[] {
  const table = screen.getByRole('table')
  return within(table)
    .getAllByRole('row')
    .slice(1) // skip header row
    .map((row) => within(row).getAllByRole('cell')[0].textContent ?? '')
    .map((text) => /(AAA|BBB|CCC)/.exec(text)?.[1] ?? '')
}

beforeEach(() => {
  useDashboardStore.setState({
    selectedWindow: 'day',
    companies: DEFAULT_COMPANIES,
    dataSource: 'mock',
  })
})

describe('RankingTable', () => {
  it('orders rows by change percent descending by default and shows Gain/Decline status', () => {
    render(<RankingTable quotes={QUOTES} />)
    expect(rowSymbols()).toEqual(['BBB', 'AAA', 'CCC'])
    expect(screen.getAllByText('Gain')).toHaveLength(2)
    expect(screen.getByText('Decline')).toBeInTheDocument()
  })

  it('re-sorts by price when the Current Price header is clicked', async () => {
    const user = userEvent.setup()
    render(<RankingTable quotes={QUOTES} />)

    await user.click(screen.getByRole('button', { name: /Current Price/ }))
    expect(rowSymbols()).toEqual(['BBB', 'CCC', 'AAA']) // price desc

    await user.click(screen.getByRole('button', { name: /Current Price/ }))
    expect(rowSymbols()).toEqual(['AAA', 'CCC', 'BBB']) // toggled to asc
  })
})

describe('ErrorNotice', () => {
  it('renders the symbol and message', () => {
    render(<ErrorNotice symbol="IBM" message="Symbol not found" />)
    expect(screen.getByText('IBM:')).toBeInTheDocument()
    expect(screen.getByText('Symbol not found')).toBeInTheDocument()
  })

  it('uses a generic title when no symbol is given', () => {
    render(<ErrorNotice message="Boom" />)
    expect(screen.getByText('Error:')).toBeInTheDocument()
  })
})

describe('DashboardPage — error path', () => {
  it('shows an error notice per company and no ranking table when the provider fails', async () => {
    const failing: FinanceProvider = {
      fetchQuote: async (symbol) => {
        throw new FinanceError(symbol, 'network', `Network down for ${symbol}`)
      },
      fetchHistory: async (symbol) => {
        throw new FinanceError(symbol, 'network', `Network down for ${symbol}`)
      },
    }

    await act(async () => {
      render(
        <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
          <DashboardPage provider={failing} />
        </SWRConfig>,
      )
    })

    expect(await screen.findByText('Network down for IBM')).toBeInTheDocument()
    expect(screen.getByText('Network down for MSFT')).toBeInTheDocument()
    expect(screen.queryByRole('table', { name: 'Daily Market Standings' })).not.toBeInTheDocument()
    expect(screen.queryByText('Intraday Highlights')).not.toBeInTheDocument()
  })
})

describe('DashboardPage — data source indicator', () => {
  it('shows "Simulated Data" when the mock source is selected', async () => {
    await act(async () => { render(<DashboardPage />) })
    expect(screen.getByText('○ Simulated Data')).toBeInTheDocument()
  })
})
