/**
 * formatters.test.ts
 *
 * Unit tests for display-formatting helpers and semantic colour/tag mapping.
 */

import { describe, expect, it } from 'vitest'
import {
  changeColor,
  changeTagType,
  formatChange,
  formatPercent,
  formatPrice,
  formatShortDate,
} from '../../utils/formatters'

describe('formatPrice', () => {
  it('formats numbers as USD with two decimals', () => {
    expect(formatPrice(182.3)).toBe('$182.30')
    expect(formatPrice(1234.5)).toBe('$1,234.50')
  })

  it('returns $0.00 for NaN', () => {
    expect(formatPrice(NaN)).toBe('$0.00')
  })
})

describe('formatChange / formatPercent', () => {
  it('prefixes positive values with +', () => {
    expect(formatChange(2.24)).toBe('+2.24')
    expect(formatPercent(1.24)).toBe('+1.24%')
  })

  it('treats zero as non-negative', () => {
    expect(formatChange(0)).toBe('+0.00')
    expect(formatPercent(0)).toBe('+0.00%')
  })

  it('keeps the minus sign for negative values', () => {
    expect(formatChange(-1.4)).toBe('-1.40')
    expect(formatPercent(-0.7)).toBe('-0.70%')
  })

  it('falls back to zero for NaN', () => {
    expect(formatChange(NaN)).toBe('+0.00')
    expect(formatPercent(NaN)).toBe('+0.00%')
  })
})

describe('formatShortDate', () => {
  it('formats ISO dates without timezone drift', () => {
    expect(formatShortDate('2024-10-07')).toBe('Oct 7')
    expect(formatShortDate('2024-01-01')).toBe('Jan 1')
  })

  it('returns an empty string for empty input', () => {
    expect(formatShortDate('')).toBe('')
  })
})

describe('changeColor / changeTagType', () => {
  it('maps direction to colour and tag type', () => {
    expect(changeColor(1)).toBe('#198038')
    expect(changeColor(-1)).toBe('#da1e28')
    expect(changeColor(0)).toBe('#525252')
    expect(changeTagType(1)).toBe('green')
    expect(changeTagType(-1)).toBe('red')
    expect(changeTagType(0)).toBe('gray')
  })
})
