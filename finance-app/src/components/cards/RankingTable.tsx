/**
 * RankingTable.tsx
 *
 * Sortable peer-comparison table showing IBM and its competitors side by side
 * using Carbon React Table components.
 */

import { useMemo, useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Tag,
} from '@carbon/react'
import { ArrowUp, ArrowDown, Subtract } from '@carbon/icons-react'
import type { Quote } from '../../types/finance'
import { changeColor, changeTagType, formatChange, formatPercent, formatPrice } from '../../utils/formatters'

interface Props {
  quotes: Quote[]
}

type SortKey = 'name' | 'price' | 'change' | 'changePercent'

export function RankingTable({ quotes }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('changePercent')
  const [asc, setAsc] = useState(false)

  const sorted = useMemo(() => {
    return [...quotes].sort((a, b) => {
      const av = a[sortKey] as string | number
      const bv = b[sortKey] as string | number
      if (av < bv) return asc ? -1 : 1
      if (av > bv) return asc ? 1 : -1
      return 0
    })
  }, [quotes, sortKey, asc])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setAsc((v) => !v)
    } else {
      setSortKey(key)
      setAsc(false)
    }
  }

  const arrow = (key: SortKey) => (sortKey === key ? (asc ? ' ↑' : ' ↓') : '')

  return (
    <TableContainer
      title="Daily Market Standings"
      description="Comparative rank ordered by intraday change"
      style={{
        backgroundColor: 'var(--cds-layer-01, #ffffff)',
        border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <Table aria-label="Company ranking table" size="lg">
        <TableHead>
          <TableRow>
            <TableHeader
              isSortable
              isSortHeader={sortKey === 'name'}
              sortDirection={asc ? 'ASC' : 'DESC'}
              onClick={() => handleSort('name')}
            >
              Company{arrow('name')}
            </TableHeader>
            <TableHeader
              isSortable
              isSortHeader={sortKey === 'price'}
              sortDirection={asc ? 'ASC' : 'DESC'}
              onClick={() => handleSort('price')}
              style={{ textAlign: 'right' }}
            >
              Current Price{arrow('price')}
            </TableHeader>
            <TableHeader
              isSortable
              isSortHeader={sortKey === 'change'}
              sortDirection={asc ? 'ASC' : 'DESC'}
              onClick={() => handleSort('change')}
              style={{ textAlign: 'right' }}
            >
              Change ($){arrow('change')}
            </TableHeader>
            <TableHeader
              isSortable
              isSortHeader={sortKey === 'changePercent'}
              sortDirection={asc ? 'ASC' : 'DESC'}
              onClick={() => handleSort('changePercent')}
              style={{ textAlign: 'right' }}
            >
              Change (%){arrow('changePercent')}
            </TableHeader>
            <TableHeader style={{ textAlign: 'center' }}>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((q, index) => {
            const isIBM = q.symbol === 'IBM'
            const color = changeColor(q.changePercent)
            const tagType = changeTagType(q.changePercent)
            const isPos = q.changePercent > 0
            const isNeg = q.changePercent < 0

            return (
              <TableRow
                key={q.symbol}
                style={{
                  backgroundColor: isIBM ? 'rgba(15, 98, 254, 0.04)' : undefined,
                  fontWeight: isIBM ? 600 : 400,
                }}
              >
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--cds-text-helper, #6f6f6f)', width: 18 }}>
                      #{index + 1}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: isIBM ? 'var(--cds-link-primary, #0f62fe)' : 'var(--cds-text-primary, #161616)',
                      }}
                    >
                      {q.symbol}
                    </span>
                    <span style={{ color: 'var(--cds-text-secondary, #525252)' }}>{q.name}</span>
                    {isIBM && (
                      <Tag type="blue" size="sm" style={{ margin: 0 }}>
                        IBM
                      </Tag>
                    )}
                  </div>
                </TableCell>
                <TableCell style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {formatPrice(q.price)}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'right',
                    color,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                  }}
                >
                  {formatChange(q.change)}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: 'right',
                    color,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 600,
                  }}
                >
                  {formatPercent(q.changePercent)}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Tag type={tagType} size="sm" style={{ margin: 0 }}>
                    {isPos ? <ArrowUp size={12} /> : isNeg ? <ArrowDown size={12} /> : <Subtract size={12} />}
                    {isPos ? 'Gain' : isNeg ? 'Decline' : 'Flat'}
                  </Tag>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
