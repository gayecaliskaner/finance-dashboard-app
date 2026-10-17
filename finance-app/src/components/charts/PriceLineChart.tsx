/**
 * PriceLineChart.tsx
 *
 * A line chart for a single company's price history with Carbon styling tokens.
 */

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HistoryPoint } from '../../types/finance'
import { formatPrice, formatShortDate } from '../../utils/formatters'

interface Props {
  data: HistoryPoint[]
  color: string
  symbol: string
}

export function PriceLineChart({ data, color, symbol }: Props) {
  if (data.length === 0) {
    return (
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
        No price data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          tickFormatter={(v: unknown) => formatPrice(v as number)}
          tick={{ fontSize: 11, fill: 'var(--cds-text-secondary, #525252)' }}
          tickLine={false}
          axisLine={false}
          width={65}
          domain={['auto', 'auto']}
        />
        <Tooltip
          formatter={(value: unknown) => [formatPrice(value as number), symbol] as [string, string]}
          labelFormatter={(label: unknown) => formatShortDate(String(label))}
          contentStyle={{
            fontSize: 12,
            borderColor: 'var(--cds-border-subtle-01, #e0e0e0)',
            backgroundColor: 'var(--cds-layer-01, #ffffff)',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={symbol === 'IBM' ? 2.5 : 2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
