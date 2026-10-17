/**
 * ComparisonAreaChart.tsx
 *
 * Overlays IBM and competitors on a single chart after normalising their series
 * to a base of 100 at the start of the window.
 * Styled with Carbon Design System tokens and layout containers.
 */

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Tile } from '@carbon/react'
import type { Company, HistorySeries } from '../../types/finance'
import { formatShortDate } from '../../utils/formatters'
import { mergeNormalisedSeries } from '../../utils/normalise'

interface Props {
  series: HistorySeries[]
  companies: Company[]
  title?: string
  description?: string
}

export function ComparisonAreaChart({
  series,
  companies,
  title = 'Relative Performance (Base 100)',
  description = 'Normalized historical trajectories for direct peer comparison',
}: Props) {
  const mergedData = mergeNormalisedSeries(series)

  if (mergedData.length === 0) {
    return (
      <Tile
        style={{
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cds-text-secondary, #525252)',
          fontSize: 13,
          backgroundColor: 'var(--cds-layer-01, #ffffff)',
        }}
      >
        No comparison data available
      </Tile>
    )
  }

  return (
    <Tile
      style={{
        backgroundColor: 'var(--cds-layer-01, #ffffff)',
        border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
        borderRadius: '4px',
        padding: '16px 20px',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--cds-text-primary, #161616)', margin: 0 }}>
          {title}
        </h3>
        <p style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', marginTop: 2 }}>
          {description}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={mergedData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <defs>
            {companies.map((c) => (
              <linearGradient key={c.symbol} id={`grad-${c.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={c.color} stopOpacity={0.0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--cds-border-subtle-01, #e0e0e0)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 11, fill: 'var(--cds-text-secondary, #525252)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--cds-border-subtle-01, #e0e0e0)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v: unknown) => `${(v as number).toFixed(0)}`}
            tick={{ fontSize: 11, fill: 'var(--cds-text-secondary, #525252)' }}
            tickLine={false}
            axisLine={false}
            width={45}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              `${(value as number).toFixed(2)} pts (${(Number(value) - 100) >= 0 ? '+' : ''}${(Number(value) - 100).toFixed(2)}%)`,
              companies.find((c) => c.symbol === name)?.name ?? String(name),
            ]}
            labelFormatter={(label: unknown) => formatShortDate(String(label))}
            contentStyle={{
              fontSize: 12,
              borderColor: 'var(--cds-border-subtle-01, #e0e0e0)',
              backgroundColor: 'var(--cds-layer-01, #ffffff)',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend
            iconType="line"
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) => {
              const comp = companies.find((c) => c.symbol === value)
              return comp ? `${comp.symbol} (${comp.name})` : value
            }}
          />
          {companies.map((c) => (
            <Area
              key={c.symbol}
              type="monotone"
              dataKey={c.symbol}
              stroke={c.color}
              strokeWidth={c.symbol === 'IBM' ? 3 : 2}
              fill={`url(#grad-${c.symbol})`}
              dot={false}
              activeDot={{ r: c.symbol === 'IBM' ? 6 : 4 }}
              connectNulls
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Tile>
  )
}
