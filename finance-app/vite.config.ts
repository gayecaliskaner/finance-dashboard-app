/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import YahooFinance from 'yahoo-finance2'

function yahooFinanceApiPlugin(): Plugin {
  let yf: any = null
  const getYf = () => {
    if (!yf) {
      const Cls = (YahooFinance as any).default ?? YahooFinance
      yf = typeof Cls === 'function' ? new Cls({ suppressNotices: ['yahooSurvey'] }) : Cls
    }
    return yf
  }

  const handleRequest = async (req: any, res: any, next: any) => {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
    if (url.pathname === '/api/finance/quote') {
      const symbol = url.searchParams.get('symbol')
      if (!symbol) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: 'Missing symbol' }))
      }
      try {
        const client = getYf()
        const result = await client.quoteSummary(symbol.toUpperCase(), {
          modules: ['price', 'summaryDetail'],
        })
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(result))
      } catch (err: any) {
        res.statusCode = err?.message?.includes('404') ? 404 : 500
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: err.message }))
      }
    }

    if (url.pathname === '/api/finance/history') {
      const symbol = url.searchParams.get('symbol')
      const windowParam = url.searchParams.get('window') || '7d'
      if (!symbol) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: 'Missing symbol' }))
      }
      try {
        const client = getYf()
        const now = Date.now()
        let period1 = new Date(now - 7 * 24 * 60 * 60 * 1000)
        let interval: any = '1d'
        if (windowParam === 'day') {
          period1 = new Date(now - 24 * 60 * 60 * 1000)
          interval = '5m'
        } else if (windowParam === 'quarter') {
          period1 = new Date(now - 90 * 24 * 60 * 60 * 1000)
          interval = '1d'
        }
        const result = await client.chart(symbol.toUpperCase(), {
          period1,
          interval,
        })
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify(result))
      } catch (err: any) {
        res.statusCode = err?.message?.includes('404') ? 404 : 500
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: err.message }))
      }
    }

    next()
  }

  return {
    name: 'yahoo-finance-api',
    configureServer(server) {
      server.middlewares.use(handleRequest)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), yahooFinanceApiPlugin()],
  build: {
    rollupOptions: {
      external: ['yahoo-finance2'],
    },
  },
  optimizeDeps: {
    exclude: ['yahoo-finance2'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    pool: 'vmThreads',
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
})
