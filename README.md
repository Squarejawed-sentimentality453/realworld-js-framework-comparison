# React vs Vue vs Svelte vs Solid vs Preact vs Lit — Real-World Comparison

Side-by-side comparison of 6 JavaScript frameworks using identical apps. Not synthetic benchmarks or hello worlds — actual apps you'd build at work.

![Dashboard](.github/dashboard.png)

## What's Inside

### 3 App Types × 6 Frameworks = 18 Apps

#### Performance Stress Test
10k row table, deep component tree, rapid state updates — measures raw rendering speed and reactivity.

![Performance Stress Test](.github/perf-stress.png)

#### CRUD Task Manager
Full task manager with filters, search, pagination, forms — measures real-world DX and ecosystem maturity.

![CRUD Task Manager](.github/crud.png)

#### Terminal Streamer
Web terminal connected to a real shell via WebSocket — measures high-frequency DOM updates and lifecycle management.

![Terminal Streamer](.github/terminal.png)

### Ecosystem Used

| | React | Vue | Svelte | Solid | Preact | Lit |
|---|---|---|---|---|---|---|
| **Routing** | React Router v7 | Vue Router | SvelteKit | @solidjs/router | preact-router | Hash router |
| **State** | Zustand | Pinia | Svelte stores | createSignal | @preact/signals | LitElement @state |
| **Server State** | TanStack Query | TanStack Vue Query | fetch + load | createResource | signals | fetch + @state |
| **Forms** | React Hook Form + Zod | VeeValidate + Zod | Native + Zod | Native + Zod | Native + Zod | Native + Zod |
| **Terminal** | xterm.js | xterm.js | xterm.js | xterm.js | xterm.js | xterm.js |
| **Styling** | Tailwind v4 | Tailwind v4 | Tailwind v4 | Tailwind v4 | Tailwind v4 | Tailwind v4 |

## Benchmark Results

Measured with Playwright headless Chromium. Median of 3 runs. All six apps render the same UI with the same data.

### Rendering Performance (ms, lower is better)

| Benchmark | React | Vue | Svelte | Solid | Preact | Lit |
|---|--:|--:|--:|--:|--:|--:|
| Create 10,000 rows | 828.8 | 270.4 | 472.1 | **235.3** | 301.0 | 278.9 |
| Update every 10th row | 258.3 | 49.5 | **35.4** | 53.7 | 78.9 | 45.4 |
| Swap rows | 194.7 | 47.7 | 45.7 | **27.9** | 80.6 | 33.9 |
| Select row | 250.6 | 29.0 | **15.6** | 222.9 | 55.1 | 18.1 |
| Append 1,000 rows | 211.6 | 69.3 | 97.8 | **47.2** | 102.9 | 74.7 |
| Clear all | 59.0 | 31.1 | 28.2 | **24.8** | 29.5 | 37.6 |

### Bundle Size (JS gzipped)

| App | React | Vue | Svelte | Solid | Preact | Lit |
|---|--:|--:|--:|--:|--:|--:|
| Perf Stress Test | 62.4 KB | 28.1 KB | 18.1 KB | **8.1 KB** | 8.8 KB | 10.0 KB |
| Terminal Streamer | 135.3 KB | 99.6 KB | 87.4 KB | **79.1 KB** | 81.5 KB | 82.5 KB |

### What the numbers say

- **Solid is fastest for bulk operations** — creating 10k rows (235ms), appending 1k (47ms), swapping (28ms), and clearing (25ms) are all best-in-class. Fine-grained reactivity without VDOM overhead.
- **Svelte wins targeted single-element updates** — selecting one row in 16ms vs React's 251ms. Compiled reactivity tracks exactly which DOM nodes to touch.
- **Lit punches above its weight** — near-Svelte on partial updates (swap 34ms, select 18ms) using plain Web Components. No framework runtime, just the platform.
- **Preact is a lighter React** — 3-4x faster than React on most benchmarks with a 7x smaller bundle (8.8 KB vs 62.4 KB). Same API, fraction of the cost.
- **Vue is the all-rounder** — competitive across every benchmark, never the slowest. Template compiler + proxy reactivity is well-optimized.
- **React has the most overhead** — consistently 3-10x slower than the others on partial updates. The VDOM diffing cost is visible at scale.
- **Solid has the smallest bundle** — 8.1 KB gzipped. Preact is close at 8.8 KB. Both are 7x smaller than React.

> Numbers will vary by machine. Run `pnpm dev:all` and test yourself.

## Quick Start

```bash
pnpm install
pnpm dev:all
```

Open **http://localhost:1355** — dashboard with links to all 18 apps.

## Running Individual Apps

```bash
# Backends (needed for CRUD and Terminal apps)
pnpm dev:server:json    # REST API on :3100
pnpm dev:server:pty     # WebSocket terminal on :3200

# Performance
pnpm dev:perf:react     # :5101
pnpm dev:perf:vue       # :5102
pnpm dev:perf:svelte    # :5103
pnpm dev:perf:solid     # :5104
pnpm dev:perf:preact    # :5105
pnpm dev:perf:lit       # :5106

# CRUD
pnpm dev:crud:react     # :5201
pnpm dev:crud:vue       # :5202
pnpm dev:crud:svelte    # :5203
pnpm dev:crud:solid     # :5204
pnpm dev:crud:preact    # :5205
pnpm dev:crud:lit       # :5206

# Terminal
pnpm dev:xterm:react    # :5301
pnpm dev:xterm:vue      # :5302
pnpm dev:xterm:svelte   # :5303
pnpm dev:xterm:solid    # :5304
pnpm dev:xterm:preact   # :5305
pnpm dev:xterm:lit      # :5306
```

## Adding a New Framework

```bash
pnpm add-framework <name>
```

Generates all 3 apps with correct ports and TODO placeholders. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Running Benchmarks

```bash
pnpm bench                                          # all benchmarks
pnpm bench -- --app perf-stress --framework react   # specific app/framework
pnpm bench -- --runs 10                             # more iterations
```

Results are written to `results/comparison.md`.

## Running Tests

```bash
pnpm e2e        # 61 Playwright E2E tests across all apps
```

## Project Structure

```
├── dashboard/           # Index page on :1355
├── apps/
│   ├── perf-stress/     # react/ vue/ svelte/ solid/ preact/ lit/
│   ├── crud/            # react/ vue/ svelte/ solid/ preact/ lit/
│   └── xterm/           # react/ vue/ svelte/ solid/ preact/ lit/
├── server/
│   ├── json/            # json-server for CRUD apps
│   └── pty/             # node-pty + WebSocket for terminal apps
├── bench/               # Playwright-based benchmark runner
├── shared/              # Types, benchmark utilities
└── e2e/                 # E2E smoke tests
```

## Tech Stack

- **Build**: Vite 6, pnpm workspaces
- **React** 19, **Vue** 3.5, **Svelte** 5 (runes), **Solid** 1.9, **Preact** 10, **Lit** 3
- **Tailwind CSS** v4
- **TypeScript** throughout
- **Playwright** for benchmarks and E2E tests

## License

MIT
