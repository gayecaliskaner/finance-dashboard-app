/**
 * DashboardPage.tsx
 *
 * Top-level page component implementing 3 distinct financial dashboard views:
 * 1. Current Day Market Summary
 * 2. Last 7 Days Trend Comparison
 * 3. Last Quarter Comparison View
 *
 * Built with Carbon Design System v11 components, separate Grid layouts for
 * each logical content group, responsive columns, and accessible tokens.
 */

import { useMemo } from 'react'
import {
  Grid,
  Column,
  Tag,
  Tile,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Toggle,
} from '@carbon/react'
import { ArrowUp, ArrowDown, Subtract } from '@carbon/icons-react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useQuotes } from '../../hooks/useQuotes'
import { useMultiHistory } from '../../hooks/useHistory'
import { TimeWindowSelector } from './TimeWindowSelector'
import { ErrorNotice } from './ErrorNotice'
import {
  QuoteSummaryCard,
  QuoteSummaryCardSkeleton,
} from '../cards/QuoteSummaryCard'
import { RankingTable } from '../cards/RankingTable'
import { PriceLineChart } from '../charts/PriceLineChart'
import { ComparisonAreaChart } from '../charts/ComparisonAreaChart'
import type { HistorySeries } from '../../types/finance'
import { type FinanceProvider, mockProvider } from '../../services/financeService'
import { calculatePeriodStats } from '../../utils/normalise'
import {
  changeColor,
  changeTagType,
  formatChange,
  formatPercent,
  formatPrice,
} from '../../utils/formatters'

export interface DashboardPageProps {
  provider?: FinanceProvider
}

export function DashboardPage({ provider }: DashboardPageProps = {}) {
  const companies = useDashboardStore((s) => s.companies)
  const selectedWindow = useDashboardStore((s) => s.selectedWindow)
  const dataSource = useDashboardStore((s) => s.dataSource)
  const setDataSource = useDashboardStore((s) => s.setDataSource)
  const symbols = companies.map((c) => c.symbol)

  // Active provider: explicit prop > store selection ('live' -> undefined for real Yahoo Finance, 'mock' -> mockProvider)
  const activeProvider = provider ?? (dataSource === 'live' ? undefined : mockProvider)

  // Quotes for current-day summary and metrics
  const quotesMap = useQuotes(symbols, activeProvider)

  // History for 7-day and quarterly trend views
  const historyMap = useMultiHistory(symbols, selectedWindow, activeProvider)

  // Aggregate loaded quotes
  const loadedQuotes = useMemo(() => {
    return symbols
      .map((sym) => quotesMap[sym]?.quote)
      .filter(Boolean) as NonNullable<(typeof quotesMap)[string]['quote']>[]
  }, [symbols, quotesMap])

  // Aggregate history series
  const historySeries: HistorySeries[] = useMemo(() => {
    return companies
      .map((c) => {
        const h = historyMap[c.symbol]
        if (!h?.history) return null
        return { symbol: c.symbol, name: c.name, color: c.color, data: h.history }
      })
      .filter(Boolean) as HistorySeries[]
  }, [companies, historyMap])

  // Intraday Market Highlights
  const marketHighlights = useMemo(() => {
    if (loadedQuotes.length === 0) return null
    const avgChangePercent =
      loadedQuotes.reduce((acc, q) => acc + q.changePercent, 0) / loadedQuotes.length
    const sortedByGain = [...loadedQuotes].sort((a, b) => b.changePercent - a.changePercent)
    const topGainer = sortedByGain[0]
    const topDecliner = sortedByGain[sortedByGain.length - 1]
    const ibmQuote = loadedQuotes.find((q) => q.symbol === 'IBM')

    return {
      avgChangePercent,
      topGainer,
      topDecliner,
      ibmQuote,
    }
  }, [loadedQuotes])

  // Period statistics for each company (7d or quarter)
  const periodStatsMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof calculatePeriodStats>> = {}
    for (const c of companies) {
      const h = historyMap[c.symbol]?.history
      if (h) {
        map[c.symbol] = calculatePeriodStats(h)
      }
    }
    return map
  }, [companies, historyMap])

  const windowTitle =
    selectedWindow === 'day'
      ? 'Current Day'
      : selectedWindow === '7d'
        ? 'Last 7 Days'
        : 'Last Quarter'

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* ── Dashboard Header ────────────────────────────────────────────── */}
      <header style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--cds-text-primary, #161616)' }}>
                Market Dashboard
              </h1>
              <Tag type="blue" size="md">Enterprise Tech</Tag>
            </div>
            <p style={{ fontSize: 13, color: 'var(--cds-text-secondary, #525252)', margin: 0 }}>
              IBM and major competitors — {windowTitle}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag type={dataSource === 'live' ? 'green' : 'warm-gray'} size="sm">
                {dataSource === 'live' ? '● Real Market Data' : '○ Simulated Data'}
              </Tag>
              <Toggle
                id="market-data-source-toggle"
                size="sm"
                labelText=""
                labelA="Mock"
                labelB="Live"
                toggled={dataSource === 'live'}
                onToggle={(checked) => setDataSource(checked ? 'live' : 'mock')}
                aria-label="Toggle Live Market Data"
              />
            </div>
            <Tag type="gray" size="sm">
              {companies.length} Tracked Companies
            </Tag>
          </div>
        </div>
      </header>

      {/* ── View Switcher Tabs ─────────────────────────────────────────── */}
      <TimeWindowSelector />

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* VIEW 1: CURRENT DAY MARKET SUMMARY                                */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {selectedWindow === 'day' && (
        <section aria-label="Current day summary">
          {/* Logical Group 1: Company Quote Summary Cards Grid */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 12 }}>
              Intraday Quotes
            </h2>
            <Grid fullWidth narrow>
              {companies.map((c) => {
                const state = quotesMap[c.symbol]
                return (
                  <Column key={c.symbol} sm={4} md={4} lg={4} xlg={3} style={{ marginBottom: 16 }}>
                    {!state || state.isLoading ? (
                      <QuoteSummaryCardSkeleton accentColor={c.color} />
                    ) : state.error ? (
                      <ErrorNotice symbol={c.symbol} message={state.error.message} />
                    ) : state.quote ? (
                      <QuoteSummaryCard
                        quote={state.quote}
                        accentColor={c.color}
                        isIBM={c.symbol === 'IBM'}
                      />
                    ) : null}
                  </Column>
                )
              })}
            </Grid>
          </div>

          {/* Logical Group 2: Key Market Highlights Grid */}
          {marketHighlights && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 12 }}>
                Intraday Highlights
              </h2>
              <Grid fullWidth narrow>
                <Column sm={4} md={4} lg={4} style={{ marginBottom: 16 }}>
                  <Tile
                    style={{
                      backgroundColor: 'var(--cds-layer-01, #ffffff)',
                      padding: 16,
                      height: '100%',
                      border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
                    }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', marginBottom: 4 }}>
                      Sector Average Return
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: changeColor(marketHighlights.avgChangePercent),
                        marginBottom: 4,
                      }}
                    >
                      {formatPercent(marketHighlights.avgChangePercent)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cds-text-secondary, #525252)' }}>
                      Across {loadedQuotes.length} monitored enterprise peers
                    </div>
                  </Tile>
                </Column>

                <Column sm={4} md={4} lg={4} style={{ marginBottom: 16 }}>
                  <Tile
                    style={{
                      backgroundColor: 'var(--cds-layer-01, #ffffff)',
                      padding: 16,
                      height: '100%',
                      border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
                    }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', marginBottom: 4 }}>
                      Top Intraday Gainer
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--cds-text-primary, #161616)' }}>
                        {marketHighlights.topGainer.symbol}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: changeColor(marketHighlights.topGainer.changePercent),
                        }}
                      >
                        {formatPercent(marketHighlights.topGainer.changePercent)}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cds-text-secondary, #525252)' }}>
                      {marketHighlights.topGainer.name} at {formatPrice(marketHighlights.topGainer.price)}
                    </div>
                  </Tile>
                </Column>

                <Column sm={4} md={4} lg={4} style={{ marginBottom: 16 }}>
                  <Tile
                    style={{
                      backgroundColor: 'var(--cds-layer-01, #ffffff)',
                      padding: 16,
                      height: '100%',
                      border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
                    }}
                  >
                    <div style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', marginBottom: 4 }}>
                      Lagging Intraday Peer
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--cds-text-primary, #161616)' }}>
                        {marketHighlights.topDecliner.symbol}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: changeColor(marketHighlights.topDecliner.changePercent),
                        }}
                      >
                        {formatPercent(marketHighlights.topDecliner.changePercent)}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cds-text-secondary, #525252)' }}>
                      {marketHighlights.topDecliner.name} at {formatPrice(marketHighlights.topDecliner.price)}
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </div>
          )}

          {/* Logical Group 3: Ranking Table Grid */}
          {loadedQuotes.length > 0 && (
            <section aria-label="Company ranking">
              <Grid fullWidth narrow>
                <Column sm={4} md={8} lg={12}>
                  <RankingTable quotes={loadedQuotes} />
                </Column>
              </Grid>
            </section>
          )}
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* VIEW 2: LAST 7 DAYS TREND COMPARISON                              */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {selectedWindow === '7d' && (
        <section aria-label="Historical comparison">
          {/* Logical Group 1: 7-Day Performance KPI Cards Grid */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 12 }}>
              7-Day Return Summaries
            </h2>
            <Grid fullWidth narrow>
              {companies.map((c) => {
                const stats = periodStatsMap[c.symbol]
                const isIBM = c.symbol === 'IBM'
                return (
                  <Column key={c.symbol} sm={4} md={4} lg={4} xlg={3} style={{ marginBottom: 16 }}>
                    <Tile
                      style={{
                        borderLeft: `4px solid ${c.color}`,
                        backgroundColor: 'var(--cds-layer-01, #ffffff)',
                        padding: 16,
                        height: '100%',
                        boxShadow: isIBM ? '0 2px 6px rgba(15, 98, 254, 0.2)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cds-text-secondary, #525252)' }}>
                          {c.symbol}
                        </span>
                        {stats && (
                          <Tag type={changeTagType(stats.changePercent)} size="sm" style={{ margin: 0 }}>
                            {stats.changePercent > 0 ? <ArrowUp size={12} /> : stats.changePercent < 0 ? <ArrowDown size={12} /> : <Subtract size={12} />}
                            {formatPercent(stats.changePercent)}
                          </Tag>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 6 }}>
                        {c.name}
                      </div>
                      {stats ? (
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cds-text-primary, #161616)', marginBottom: 2 }}>
                            {formatPrice(stats.end)}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)' }}>
                            7d Range: {formatPrice(stats.min)} - {formatPrice(stats.max)}
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--cds-text-secondary, #525252)' }}>Loading 7d data…</div>
                      )}
                    </Tile>
                  </Column>
                )
              })}
            </Grid>
          </div>

          {/* Logical Group 2: Comparison Area Chart Grid */}
          {historySeries.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <Grid fullWidth narrow>
                <Column sm={4} md={8} lg={12}>
                  <ComparisonAreaChart
                    series={historySeries}
                    companies={companies}
                    title="7-Day Relative Performance (Base 100)"
                    description="Comparative movement normalized to 100 at start of the 7-day period"
                  />
                </Column>
              </Grid>
            </div>
          )}

          {/* Logical Group 3: Per-Company Price Trajectory Charts Grid */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 12 }}>
              Individual 7-Day Price Trajectories
            </h2>
            <Grid fullWidth narrow>
              {companies.map((c) => {
                const h = historyMap[c.symbol]
                const stats = periodStatsMap[c.symbol]
                return (
                  <Column key={c.symbol} sm={4} md={4} lg={6} style={{ marginBottom: 20 }}>
                    <Tile
                      style={{
                        backgroundColor: 'var(--cds-layer-01, #ffffff)',
                        border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
                        borderTop: `3px solid ${c.color}`,
                        borderRadius: 4,
                        padding: 16,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--cds-text-primary, #161616)', marginRight: 6 }}>
                            {c.symbol}
                          </span>
                          <span style={{ fontSize: 13, color: 'var(--cds-text-secondary, #525252)' }}>
                            {c.name}
                          </span>
                        </div>
                        {stats && (
                          <div style={{ fontSize: 13, fontWeight: 600, color: changeColor(stats.changePercent) }}>
                            {formatChange(stats.change)} ({formatPercent(stats.changePercent)})
                          </div>
                        )}
                      </div>

                      {h?.isLoading && (
                        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cds-text-helper, #6f6f6f)' }}>
                          Loading 7-day chart…
                        </div>
                      )}
                      {h?.error && <ErrorNotice symbol={c.symbol} message={h.error.message} />}
                      {h?.history && (
                        <PriceLineChart data={h.history} color={c.color} symbol={c.symbol} />
                      )}
                    </Tile>
                  </Column>
                )
              })}
            </Grid>
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* VIEW 3: LAST QUARTER COMPARISON VIEW                              */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {selectedWindow === 'quarter' && (
        <section aria-label="Quarterly comparison">
          {/* Logical Group 1: Quarterly Performance KPI Overview Grid */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 12 }}>
              Quarterly Return Overview (3 Months)
            </h2>
            <Grid fullWidth narrow>
              {companies.map((c) => {
                const stats = periodStatsMap[c.symbol]
                const isIBM = c.symbol === 'IBM'
                return (
                  <Column key={c.symbol} sm={4} md={4} lg={4} xlg={3} style={{ marginBottom: 16 }}>
                    <Tile
                      style={{
                        borderLeft: `4px solid ${c.color}`,
                        backgroundColor: 'var(--cds-layer-01, #ffffff)',
                        padding: 16,
                        height: '100%',
                        boxShadow: isIBM ? '0 2px 6px rgba(15, 98, 254, 0.2)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cds-text-secondary, #525252)' }}>
                          {c.symbol}
                        </span>
                        {stats && (
                          <Tag type={changeTagType(stats.changePercent)} size="sm" style={{ margin: 0 }}>
                            {stats.changePercent > 0 ? <ArrowUp size={12} /> : stats.changePercent < 0 ? <ArrowDown size={12} /> : <Subtract size={12} />}
                            {formatPercent(stats.changePercent)}
                          </Tag>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 6 }}>
                        {c.name}
                      </div>
                      {stats ? (
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cds-text-primary, #161616)', marginBottom: 2 }}>
                            {formatPrice(stats.end)}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)' }}>
                            Quarter Range: {formatPrice(stats.min)} - {formatPrice(stats.max)}
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--cds-text-secondary, #525252)' }}>Loading quarterly data…</div>
                      )}
                    </Tile>
                  </Column>
                )
              })}
            </Grid>
          </div>

          {/* Logical Group 2: Quarterly Comparison Chart Grid */}
          {historySeries.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <Grid fullWidth narrow>
                <Column sm={4} md={8} lg={12}>
                  <ComparisonAreaChart
                    series={historySeries}
                    companies={companies}
                    title="Quarterly Relative Performance (Base 100)"
                    description="Relative performance trajectories indexed to 100 at the start of the quarter"
                  />
                </Column>
              </Grid>
            </div>
          )}

          {/* Logical Group 3: Quarterly Breakdown Table Grid */}
          <div>
            <Grid fullWidth narrow>
              <Column sm={4} md={8} lg={12}>
                <TableContainer
                  title="Quarterly Financial Metrics Breakdown"
                  description="Detailed opening, range, and total quarter return comparisons across IBM and peers"
                  style={{
                    backgroundColor: 'var(--cds-layer-01, #ffffff)',
                    border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
                    borderRadius: 4,
                  }}
                >
                  <Table aria-label="Quarterly breakdown table" size="lg">
                    <TableHead>
                      <TableRow>
                        <TableHeader>Company</TableHeader>
                        <TableHeader style={{ textAlign: 'right' }}>Quarter Open</TableHeader>
                        <TableHeader style={{ textAlign: 'right' }}>Quarter High</TableHeader>
                        <TableHeader style={{ textAlign: 'right' }}>Quarter Low</TableHeader>
                        <TableHeader style={{ textAlign: 'right' }}>Current Price</TableHeader>
                        <TableHeader style={{ textAlign: 'right' }}>Quarter Return ($)</TableHeader>
                        <TableHeader style={{ textAlign: 'right' }}>Quarter Return (%)</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companies.map((c) => {
                        const stats = periodStatsMap[c.symbol]
                        const isIBM = c.symbol === 'IBM'
                        return (
                          <TableRow
                            key={c.symbol}
                            style={{
                              backgroundColor: isIBM ? 'rgba(15, 98, 254, 0.04)' : undefined,
                              fontWeight: isIBM ? 600 : 400,
                            }}
                          >
                            <TableCell>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: isIBM ? 'var(--cds-link-primary, #0f62fe)' : 'var(--cds-text-primary, #161616)',
                                  }}
                                >
                                  {c.symbol}
                                </span>
                                <span style={{ color: 'var(--cds-text-secondary, #525252)' }}>{c.name}</span>
                                {isIBM && (
                                  <Tag type="blue" size="sm" style={{ margin: 0 }}>
                                    IBM
                                  </Tag>
                                )}
                              </div>
                            </TableCell>
                            <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {stats ? formatPrice(stats.start) : '—'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {stats ? formatPrice(stats.max) : '—'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {stats ? formatPrice(stats.min) : '—'}
                            </TableCell>
                            <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                              {stats ? formatPrice(stats.end) : '—'}
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: 'right',
                                color: stats ? changeColor(stats.change) : undefined,
                                fontVariantNumeric: 'tabular-nums',
                                fontWeight: 600,
                              }}
                            >
                              {stats ? formatChange(stats.change) : '—'}
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: 'right',
                                color: stats ? changeColor(stats.changePercent) : undefined,
                                fontVariantNumeric: 'tabular-nums',
                                fontWeight: 600,
                              }}
                            >
                              {stats ? (
                                <Tag type={changeTagType(stats.changePercent)} size="sm" style={{ margin: 0 }}>
                                  {formatPercent(stats.changePercent)}
                                </Tag>
                              ) : (
                                '—'
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Column>
            </Grid>
          </div>
        </section>
      )}
    </div>
  )
}
