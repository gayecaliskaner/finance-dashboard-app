/**
 * FocusedCompanyChart.tsx
 *
 * Displays a price-history chart for the user-selected company (focusedSymbol).
 * Renders loading / error / no-data / chart states independently of the
 * comparison dashboards. Never mutates the shared companies list.
 */

import { Tile, InlineLoading } from '@carbon/react'
import { useDashboardStore, getCompanyColor, COMPETITOR_CATALOG } from '../../store/dashboardStore'
import { useHistory } from '../../hooks/useHistory'
import { PriceLineChart } from './PriceLineChart'
import { ErrorNotice } from '../dashboard/ErrorNotice'
import { type FinanceProvider, mockProvider } from '../../services/financeService'

interface Props {
  provider?: FinanceProvider
}

export function FocusedCompanyChart({ provider }: Props = {}) {
  const focusedSymbol = useDashboardStore((s) => s.focusedSymbol)
  const selectedWindow = useDashboardStore((s) => s.selectedWindow)
  const dataSource = useDashboardStore((s) => s.dataSource)

  const activeProvider = provider ?? (dataSource === 'live' ? undefined : mockProvider)

  // Derive a display name and colour from the catalog if available
  const catalogEntry = COMPETITOR_CATALOG.find((c) => c.symbol === focusedSymbol)
  const displayName = catalogEntry?.name ?? focusedSymbol ?? ''
  // Use a stable colour: catalog entry colour, or a deterministic palette slot
  const color = catalogEntry?.color ?? getCompanyColor(7)

  const { history, isLoading, error } = useHistory(
    focusedSymbol ?? '',
    selectedWindow,
    activeProvider,
  )

  // Nothing to show until a symbol is chosen
  if (!focusedSymbol) return null

  const windowLabel =
    selectedWindow === 'day' ? 'Current Day' : selectedWindow === '7d' ? 'Last 7 Days' : 'Last Quarter'

  return (
    <Tile
      style={{
        backgroundColor: 'var(--cds-layer-01, #ffffff)',
        border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
        borderTop: `3px solid ${color}`,
        borderRadius: 4,
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--cds-text-primary, #161616)',
            margin: 0,
          }}
        >
          {focusedSymbol}
          {displayName && displayName !== focusedSymbol && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--cds-text-secondary, #525252)',
                marginLeft: 8,
              }}
            >
              {displayName}
            </span>
          )}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', marginTop: 2 }}>
          Price history — {windowLabel}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InlineLoading description={`Loading ${focusedSymbol} data…`} status="active" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <ErrorNotice symbol={focusedSymbol} message={error.message} />
      )}

      {/* No data (success but empty) */}
      {!isLoading && !error && history && history.length === 0 && (
        <div
          style={{
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cds-text-secondary, #525252)',
            fontSize: 13,
          }}
        >
          No price data available for <strong style={{ marginLeft: 4 }}>{focusedSymbol}</strong>.
        </div>
      )}

      {/* Chart */}
      {!isLoading && !error && history && history.length > 0 && (
        <PriceLineChart data={history} color={color} symbol={focusedSymbol} />
      )}

      {/* Day view note — useHistory returns null key for 'day' */}
      {!isLoading && !error && selectedWindow === 'day' && !history && (
        <div
          style={{
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cds-text-secondary, #525252)',
            fontSize: 13,
          }}
        >
          Select the <strong style={{ margin: '0 4px' }}>7 Days</strong> or{' '}
          <strong style={{ margin: '0 4px' }}>Quarter</strong> tab to see price history for{' '}
          {focusedSymbol}.
        </div>
      )}
    </Tile>
  )
}
