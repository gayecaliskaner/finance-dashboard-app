# Finance Dashboard App

A React-based market dashboard application built as part of the IBM Bob GitHub SDLC Lab.

Tracks **IBM** and four major competitors (Microsoft, Oracle, SAP, Salesforce) using Yahoo Finance data,
and presents three time-window views: current day, last 7 days, and last quarter.

---

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and produce a production bundle |
| `npm test` | Run all tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate a coverage report |
| `npm run lint` | Run the oxlint linter |
| `npm run typecheck` | Type-check app and test sources (`tsconfig.test.json`) |
| `npm run validate` | Lint + typecheck + tests + build (same gate as CI) |
| `npm run preview` | Preview the production build locally |

---

## Local Validation (full gate)

Run these before committing or opening a PR:

```bash
npm run validate          # runs everything below in order, stops on first failure
# or individually:
npm run lint              # oxlint — expect "0 warnings and 0 errors"
npm run typecheck         # tsc over src including tests — no output, exit 0
npm test                  # all unit + integration tests — all files/tests pass
npm run build             # tsc -b + vite build — "built in …", exit 0
```

All commands must exit 0. The same sequence runs in `.github/workflows/finance-app-ci.yml`.

---

## Project Structure

```
src/
├── components/
│   ├── cards/            QuoteSummaryCard, RankingTable
│   ├── charts/           PriceLineChart, ComparisonAreaChart
│   └── dashboard/        DashboardPage, TimeWindowSelector, ErrorNotice
├── hooks/                useQuotes, useHistory (SWR-based)
├── services/             financeService (public API), yahooAdapter, mockData
├── store/                dashboardStore (Zustand)
├── tests/
│   ├── unit/             normalise, financeService
│   └── integration/      DashboardPage
├── types/                finance.ts — shared TypeScript types
└── utils/                normalise, formatters
```

---

## Data Source

The application uses **[yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2)** for real market data with automatic offline mock fallback.

- **In the Browser UI**: Real market data is active by default. You can switch between **Live Market Data** and **Simulated Data** anytime using the Toggle switch in the header.
- **In Automated Tests**: The test suite runs against the mock provider for deterministic, fast, offline execution.

---

## Adding a New Company

1. Add an entry to `DEFAULT_COMPANIES` in [`src/store/dashboardStore.ts`](src/store/dashboardStore.ts).
2. Add matching mock fixtures in [`src/services/mockData.ts`](src/services/mockData.ts).
3. No component changes required.

---

## GitHub Workflow

This application is part of a two-part lab:

- **Part 1** — Build and validate the application (this folder)
- **Part 2** — Evolve the application through GitHub issues and PRs

See [`WORKSHOP-part2-GITHUB-AUTOMATION.md`](../WORKSHOP-part2-GITHUB-AUTOMATION.md) for the GitHub automation lab.
