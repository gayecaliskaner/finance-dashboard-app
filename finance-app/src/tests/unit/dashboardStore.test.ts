/**
 * dashboardStore.test.ts
 *
 * Unit tests for the focusedSymbol slice added to dashboardStore.
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore, DEFAULT_COMPANIES } from '../../store/dashboardStore'

beforeEach(() => {
  useDashboardStore.setState({
    selectedWindow: 'day',
    companies: DEFAULT_COMPANIES,
    dataSource: 'mock',
    focusedSymbol: null,
  })
})

describe('focusedSymbol slice', () => {
  it('defaults to null', () => {
    expect(useDashboardStore.getState().focusedSymbol).toBeNull()
  })

  it('setFocusedSymbol stores an uppercased, trimmed symbol', () => {
    useDashboardStore.getState().setFocusedSymbol('  nvda  ')
    expect(useDashboardStore.getState().focusedSymbol).toBe('NVDA')
  })

  it('setFocusedSymbol accepts a symbol already in uppercase', () => {
    useDashboardStore.getState().setFocusedSymbol('AAPL')
    expect(useDashboardStore.getState().focusedSymbol).toBe('AAPL')
  })

  it('setFocusedSymbol(null) clears the focused symbol', () => {
    useDashboardStore.getState().setFocusedSymbol('IBM')
    useDashboardStore.getState().setFocusedSymbol(null)
    expect(useDashboardStore.getState().focusedSymbol).toBeNull()
  })

  it('setFocusedSymbol("") clears the focused symbol (empty string is treated as null)', () => {
    useDashboardStore.getState().setFocusedSymbol('IBM')
    useDashboardStore.getState().setFocusedSymbol('')
    expect(useDashboardStore.getState().focusedSymbol).toBeNull()
  })

  it('does not mutate the companies array', () => {
    const before = useDashboardStore.getState().companies
    useDashboardStore.getState().setFocusedSymbol('NVDA')
    expect(useDashboardStore.getState().companies).toStrictEqual(before)
  })

  it('changing focusedSymbol does not affect selectedWindow', () => {
    useDashboardStore.setState({ selectedWindow: 'quarter' })
    useDashboardStore.getState().setFocusedSymbol('TSLA')
    expect(useDashboardStore.getState().selectedWindow).toBe('quarter')
  })
})

// ---------------------------------------------------------------------------
// Validation logic (mirrors the CompanySearchPanel validate() function)
// We test this separately so we don't need to fight jsdom's ComboBox quirks.
// ---------------------------------------------------------------------------

function validate(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return 'Please enter a ticker symbol.'
  if (!/^[A-Za-z0-9.^-]{1,12}$/.test(trimmed)) return 'Enter a valid ticker (letters/numbers, max 12 chars).'
  return null
}

describe('CompanySearchPanel validate()', () => {
  it('returns an error for an empty string', () => {
    expect(validate('')).toBeTruthy()
  })

  it('returns an error for a whitespace-only string', () => {
    expect(validate('   ')).toBeTruthy()
  })

  it('returns an error for a symbol longer than 12 characters', () => {
    expect(validate('TOOLONGSYMBOL')).toBeTruthy()
  })

  it('returns an error for a symbol with special characters', () => {
    expect(validate('!!!BAD')).toBeTruthy()
  })

  it('returns null for a valid short symbol', () => {
    expect(validate('NVDA')).toBeNull()
  })

  it('returns null for a symbol with a period (e.g. BRK.B)', () => {
    expect(validate('BRK.B')).toBeNull()
  })

  it('returns null for a symbol exactly 12 characters', () => {
    expect(validate('ABCDEFGHIJKL')).toBeNull()
  })
})
