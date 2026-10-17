/**
 * App.tsx
 *
 * Root shell for the Carbon React Finance Application.
 * Includes Carbon Header masthead and responsive container.
 */

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  Theme,
  Content,
  Tag,
} from '@carbon/react'
import { DashboardPage } from './components/dashboard/DashboardPage'

export default function App() {
  return (
    <Theme theme="white">
      <Header aria-label="IBM Market Insights">
        <HeaderName href="#" prefix="IBM">
          Finance Insights
        </HeaderName>
        <HeaderGlobalBar>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
            <Tag type="cool-gray" size="sm">
              Live Demo
            </Tag>
          </div>
        </HeaderGlobalBar>
      </Header>

      <Content style={{ minHeight: 'calc(100vh - 48px)', backgroundColor: 'var(--cds-background, #f4f4f4)', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <DashboardPage />
        </div>
      </Content>
    </Theme>
  )
}
