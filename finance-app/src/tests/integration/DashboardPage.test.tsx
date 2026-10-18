/**
 * DashboardPage.test.tsx
 *
 * Integration tests — renders DashboardPage with Carbon Design System components
 * and verifies all 3 dashboard views:
 * 1. Current Day Market Summary
 * 2. Last 7 Days Trend Comparison
 * 3. Last Quarter Comparison View
 */

import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import { DashboardPage } from '../../components/dashboard/DashboardPage'
import { DEFAULT_COMPANIES, useDashboardStore } from '../../store/dashboardStore'

beforeEach(() => {
  useDashboardStore.setState({
    selectedWindow: 'day',
    companies: DEFAULT_COMPANIES,
  })
})

describe('DashboardPage — Current Day Market Summary View', () => {
  it('renders the header and company count', async () => {
    await act(async () => { render(<DashboardPage />) })
    expect(screen.getByText('Market Dashboard')).toBeInTheDocument()
    expect(screen.getByText('5 Tracked Companies')).toBeInTheDocument()
    expect(screen.getByText('IBM and major competitors — Current Day')).toBeInTheDocument()
  })

  it('renders the time-window tabs with "Today" selected by default', async () => {
    await act(async () => { render(<DashboardPage />) })
    const todayTab = screen.getByRole('tab', { name: 'Today' })
    const sevenDayTab = screen.getByRole('tab', { name: 'Last 7 Days' })
    const monthTab = screen.getByRole('tab', { name: 'Last Month' })
    const quarterTab = screen.getByRole('tab', { name: 'Last Quarter' })

    expect(todayTab).toBeInTheDocument()
    expect(sevenDayTab).toBeInTheDocument()
    expect(monthTab).toBeInTheDocument()
    expect(quarterTab).toBeInTheDocument()
    expect(todayTab).toHaveAttribute('aria-selected', 'true')
  })

  it('renders quote summary cards for IBM and competitors', async () => {
    await act(async () => { render(<DashboardPage />) })
    expect(screen.getByRole('region', { name: 'IBM summary' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Microsoft summary' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Oracle summary' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'SAP SE summary' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Salesforce summary' })).toBeInTheDocument()
  })

  it('renders intraday market highlights', async () => {
    await act(async () => { render(<DashboardPage />) })
    expect(screen.getByText('Sector Average Return')).toBeInTheDocument()
    expect(screen.getByText('Top Intraday Gainer')).toBeInTheDocument()
    expect(screen.getByText('Lagging Intraday Peer')).toBeInTheDocument()
  })

  it('renders the daily ranking table', async () => {
    await act(async () => { render(<DashboardPage />) })
    expect(screen.getByText('Daily Market Standings')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Daily Market Standings' })).toBeInTheDocument()
  })
})

describe('DashboardPage — Last 7 Days Trend Comparison View', () => {
  it('switches to 7-day view and renders 7-day summary cards, chart, and trajectories', async () => {
    const user = userEvent.setup()
    await act(async () => { render(<DashboardPage />) })

    await user.click(screen.getByRole('tab', { name: 'Last 7 Days' }))
    expect(screen.getByRole('tab', { name: 'Last 7 Days' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('IBM and major competitors — Last 7 Days')).toBeInTheDocument()

    // 7-day sections
    expect(screen.getByText('7-Day Return Summaries')).toBeInTheDocument()
    expect(screen.getByText('7-Day Relative Performance (Base 100)')).toBeInTheDocument()
    expect(screen.getByText('Individual 7-Day Price Trajectories')).toBeInTheDocument()
  })
})

describe('DashboardPage — Last Month Comparison View', () => {
  it('switches to month view and renders monthly return overview, comparison chart, and breakdown table', async () => {
    const user = userEvent.setup()
    await act(async () => { render(<DashboardPage />) })

    await user.click(screen.getByRole('tab', { name: 'Last Month' }))
    expect(screen.getByRole('tab', { name: 'Last Month' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('IBM and major competitors — Last Month')).toBeInTheDocument()

    // Monthly sections
    expect(screen.getByText('Monthly Return Overview (30 Days)')).toBeInTheDocument()
    expect(screen.getByText('Monthly Relative Performance (Base 100)')).toBeInTheDocument()
    expect(screen.getByText('Monthly Financial Metrics Breakdown')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Monthly Financial Metrics Breakdown' })).toBeInTheDocument()
  })
})

describe('DashboardPage — Last Quarter Comparison View', () => {
  it('switches to quarter view and renders quarterly return overview, comparison chart, and breakdown table', async () => {
    const user = userEvent.setup()
    await act(async () => { render(<DashboardPage />) })

    await user.click(screen.getByRole('tab', { name: 'Last Quarter' }))
    expect(screen.getByRole('tab', { name: 'Last Quarter' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('IBM and major competitors — Last Quarter')).toBeInTheDocument()

    // Quarterly sections
    expect(screen.getByText('Quarterly Return Overview (3 Months)')).toBeInTheDocument()
    expect(screen.getByText('Quarterly Relative Performance (Base 100)')).toBeInTheDocument()
    expect(screen.getByText('Quarterly Financial Metrics Breakdown')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Quarterly Financial Metrics Breakdown' })).toBeInTheDocument()
  })
})

describe('DashboardPage — Dynamic Company Extension', () => {
  it('supports dynamically adding competitor companies to the dashboard', async () => {
    useDashboardStore.getState().addCompany({
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      color: '#ea4335',
    })

    await act(async () => { render(<DashboardPage />) })
    expect(screen.getByText('6 Tracked Companies')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Alphabet Inc. summary' })).toBeInTheDocument()
    expect(screen.getAllByText('GOOGL').length).toBeGreaterThan(0)
  })
})
