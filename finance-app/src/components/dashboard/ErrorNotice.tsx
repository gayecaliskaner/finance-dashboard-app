/**
 * ErrorNotice.tsx
 *
 * Inline notification shown when a data fetch fails, built using Carbon React InlineNotification.
 */

import { InlineNotification } from '@carbon/react'

interface Props {
  message: string
  symbol?: string
}

export function ErrorNotice({ message, symbol }: Props) {
  return (
    <InlineNotification
      kind="error"
      lowContrast
      hideCloseButton
      title={symbol ? `${symbol}:` : 'Error:'}
      subtitle={message}
      style={{ margin: 0, width: '100%' }}
    />
  )
}
