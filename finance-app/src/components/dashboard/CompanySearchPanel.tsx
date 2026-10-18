/**
 * CompanySearchPanel.tsx
 *
 * Lets the user enter or pick a ticker symbol to display a focused chart.
 * Uses a Carbon ComboBox so both free-text entry and catalog selection work.
 * Calls setFocusedSymbol() on submit; never mutates the comparison companies list.
 */

import { useState } from 'react'
import { Button, ComboBox } from '@carbon/react'
import { Search } from '@carbon/icons-react'
import { useDashboardStore, COMPETITOR_CATALOG } from '../../store/dashboardStore'

const CATALOG_ITEMS = COMPETITOR_CATALOG.map((c) => ({
  id: c.symbol,
  label: `${c.symbol} — ${c.name}`,
  symbol: c.symbol,
}))

function validate(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return 'Please enter a ticker symbol.'
  if (!/^[A-Za-z0-9.^-]{1,12}$/.test(trimmed)) return 'Enter a valid ticker (letters/numbers, max 12 chars).'
  return null
}

export function CompanySearchPanel() {
  const setFocusedSymbol = useDashboardStore((s) => s.setFocusedSymbol)
  const focusedSymbol = useDashboardStore((s) => s.focusedSymbol)

  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    const validationError = validate(inputValue)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setFocusedSymbol(inputValue.trim().toUpperCase())
  }

  function handleClear() {
    setInputValue('')
    setError(null)
    setFocusedSymbol(null)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 12,
        padding: '16px 20px',
        backgroundColor: 'var(--cds-layer-01, #ffffff)',
        border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
        borderRadius: 4,
        marginBottom: 20,
      }}
    >
      <div style={{ flex: '1 1 260px', minWidth: 220 }}>
        <ComboBox
          id="company-search-combobox"
          titleText="Company symbol"
          placeholder="e.g. NVDA, AAPL, IBM"
          invalid={!!error}
          invalidText={error ?? ''}
          items={CATALOG_ITEMS}
          itemToString={(item) => (item ? item.symbol : '')}
          onInputChange={(val: string) => {
            setInputValue(val)
            if (error) setError(null)
          }}
          onChange={({ selectedItem }) => {
            if (selectedItem) {
              setInputValue(selectedItem.symbol)
              if (error) setError(null)
            }
          }}
        />
      </div>

      <Button kind="primary" size="md" renderIcon={Search} onClick={handleSubmit}>
        Load Chart
      </Button>

      {focusedSymbol && (
        <Button kind="ghost" size="md" onClick={handleClear}>
          Clear
        </Button>
      )}
    </div>
  )
}
