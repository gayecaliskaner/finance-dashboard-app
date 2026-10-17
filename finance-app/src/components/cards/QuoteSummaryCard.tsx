/**
 * QuoteSummaryCard.tsx
 *
 * Displays current-day quote summary for a single company using Carbon React Tile,
 * Tag, and directional indicators.
 */

import { Tile, Tag, SkeletonText } from '@carbon/react'
import { ArrowUp, ArrowDown, Subtract } from '@carbon/icons-react'
import type { Quote } from '../../types/finance'
import { changeColor, changeTagType, formatChange, formatPercent, formatPrice } from '../../utils/formatters'

interface Props {
  quote: Quote
  accentColor: string
  isIBM?: boolean
  isLoading?: boolean
}

export function QuoteSummaryCard({ quote, accentColor, isIBM = false, isLoading = false }: Props) {
  const isPositive = quote.changePercent > 0
  const isNegative = quote.changePercent < 0
  const color = changeColor(quote.changePercent)
  const tagType = changeTagType(quote.changePercent)

  return (
    <Tile
      role="region"
      aria-label={`${quote.name} summary`}
      className="finance-kpi-card"
      style={{
        borderLeft: `4px solid ${accentColor}`,
        backgroundColor: 'var(--cds-layer-01, #ffffff)',
        boxShadow: isIBM ? '0 2px 6px rgba(15, 98, 254, 0.2)' : undefined,
        padding: '16px',
        height: '100%',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--cds-text-secondary, #525252)' }}>
            {quote.symbol}
          </span>
          {isIBM && (
            <Tag type="blue" size="sm" style={{ margin: 0, fontWeight: 600 }}>
              Primary
            </Tag>
          )}
        </div>
        <Tag type={tagType} size="sm" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
          {isPositive ? <ArrowUp size={12} /> : isNegative ? <ArrowDown size={12} /> : <Subtract size={12} />}
          {formatPercent(quote.changePercent)}
        </Tag>
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--cds-text-primary, #161616)',
          marginBottom: 6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={quote.name}
      >
        {quote.name}
      </div>

      <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', marginBottom: 4 }}>
        {formatPrice(quote.price)}
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{formatChange(quote.change)}</span>
        <span style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', fontWeight: 400 }}>
          vs prev close {formatPrice(quote.previousClose)}
        </span>
      </div>
    </Tile>
  )
}

/** Skeleton card shown while data is loading. */
export function QuoteSummaryCardSkeleton({ accentColor }: { accentColor: string }) {
  return (
    <Tile
      className="finance-kpi-card"
      style={{
        borderLeft: `4px solid ${accentColor}`,
        backgroundColor: 'var(--cds-layer-01, #ffffff)',
        padding: '16px',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <SkeletonText width="40px" />
        <SkeletonText width="50px" />
      </div>
      <div style={{ marginBottom: 8 }}>
        <SkeletonText width="100px" heading />
      </div>
      <SkeletonText width="80px" lineCount={2} />
    </Tile>
  )
}
