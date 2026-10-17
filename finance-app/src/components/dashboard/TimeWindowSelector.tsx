/**
 * TimeWindowSelector.tsx
 *
 * Tab bar for switching between the three dashboard views:
 * - Current Day Market Summary
 * - Last 7 Days Trend Comparison
 * - Last Quarter Comparison View
 *
 * Built with Carbon Design System components and styling tokens.
 */

import { Tab, TabList, Tabs } from '@carbon/react'
import { Calendar, ChartLine, Dashboard } from '@carbon/icons-react'
import type { TimeWindow } from '../../types/finance'
import { useDashboardStore } from '../../store/dashboardStore'

const WINDOW_CONFIG: { value: TimeWindow; label: string; icon: typeof Dashboard; index: number }[] = [
  { value: 'day', label: 'Today', icon: Dashboard, index: 0 },
  { value: '7d', label: 'Last 7 Days', icon: ChartLine, index: 1 },
  { value: 'quarter', label: 'Last Quarter', icon: Calendar, index: 2 },
]

export function TimeWindowSelector() {
  const selectedWindow = useDashboardStore((s) => s.selectedWindow)
  const setWindow = useDashboardStore((s) => s.setWindow)

  const activeIndex = WINDOW_CONFIG.findIndex((w) => w.value === selectedWindow)

  return (
    <div style={{ marginBottom: 24 }}>
      <Tabs
        selectedIndex={activeIndex >= 0 ? activeIndex : 0}
        onChange={({ selectedIndex }) => {
          const target = WINDOW_CONFIG[selectedIndex]
          if (target) {
            setWindow(target.value)
          }
        }}
      >
        <TabList aria-label="Dashboard views" contained>
          {WINDOW_CONFIG.map(({ value, label, icon: Icon }) => (
            <Tab
              key={value}
              onClick={() => setWindow(value)}
              renderIcon={Icon}
            >
              {label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  )
}
