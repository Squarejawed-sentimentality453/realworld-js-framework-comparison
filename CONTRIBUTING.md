# Adding a New Framework

This guide covers how to add a new JavaScript framework to the comparison.

## Quick Start

```bash
pnpm tsx scripts/add-framework.ts <framework-name>
```

This generates all 3 apps (perf-stress, crud, xterm) with the correct structure, ports, and placeholder code.

## What Each App Must Do

Every framework implementation must produce the **same UI and behavior**. Users should be able to switch between frameworks and see identical functionality.

### 1. Performance Stress Test (`apps/perf-stress/<framework>/`)

**Must implement these benchmarks:**

| Benchmark | What it does |
|-----------|-------------|
| Create 10,000 rows | Render a keyed table with 10k rows (id + random label) |
| Update every 10th row | Append " !!!" to every 10th row's label |
| Swap rows | Swap rows at index 1 and 998 |
| Select row | Highlight one row (toggle a CSS class) |
| Append 1,000 rows | Add 1k rows to the existing list |
| Clear all | Remove all rows from DOM |

**Must also implement:**
- **Deep Tree** — recursive component with configurable depth (default 500), mount/update/unmount benchmarks
- **Rapid Counter** — increment state in a `requestAnimationFrame` loop for N seconds, report FPS

**Contracts:**
- Use `buildData(count)` and `resetId()` from `shared/bench-utils.ts` to generate row data
- Use `runTimed(name, framework, app, fn)` from `shared/bench-utils.ts` to measure timing
- Results must be pushed to `window.__BENCH_RESULTS__` (the benchmark runner reads this)
- The table must use **keyed rendering** (React: `key={row.id}`, Vue: `:key="row.id"`, etc.)
- UI layout: tab bar (List Operations / Deep Tree / Rapid Counter) → controls → content → results table

**Reference:** `apps/perf-stress/react/` is the canonical implementation.

### 2. CRUD Task Manager (`apps/crud/<framework>/`)

**Features required:**
- Home page with pending/in-progress/done counts
- Task list with filters (status, category), sort (date, title, priority), search, pagination (10/page)
- Create task form with validation (title required, description required, status, priority, category)
- Edit task form (same as create, pre-filled)
- Delete task

**Contracts:**
- API base: `http://localhost:3100`
- Endpoints: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id`, `GET /categories`
- Validation: use Zod with the schema from `shared/types.ts`
- Pagination/sort/search is client-side (json-server v1 doesn't support query params for this)
- Nav bar must show the framework's SVG icon

**Reference:** `apps/crud/react/` is the canonical implementation.

### 3. Terminal Streamer (`apps/xterm/<framework>/`)

**Features required:**
- xterm.js terminal connected to the PTY server via WebSocket
- Connection status indicator (green dot = connected, red = disconnected)
- Auto-resize on window resize (FitAddon)
- Search addon and web links addon loaded

**Contracts:**
- WebSocket URL: `ws://localhost:3200`
- Send resize events: `JSON.stringify({ type: "resize", cols, rows })`
- Delay `fitAddon.fit()` and WebSocket connection by 200ms after `terminal.open()` (xterm v5 renderer needs time)
- Wrap `fitAddon.fit()` in try/catch (can throw before renderer is ready)
- Header bar: framework icon + "Terminal" title
- Status bar: framework icon (16px) + "xterm.js" text

**Reference:** `apps/xterm/react/` is the canonical implementation.

## Port Convention

| App Type | Port Pattern | Example |
|----------|-------------|---------|
| Perf Stress | 51xx | react=5101, vue=5102, svelte=5103 |
| CRUD | 52xx | react=5201, vue=5202, svelte=5203 |
| Terminal | 53xx | react=5301, vue=5302, svelte=5303 |

New frameworks get the next number (e.g. 4th framework = 5104, 5204, 5304).

## Checklist After Scaffolding

After running the scaffold script:

- [ ] Install framework-specific Vite plugin (`@vitejs/plugin-react`, etc.)
- [ ] Add framework + plugin to `package.json` dependencies
- [ ] Update `vite.config.ts` with the correct plugin
- [ ] Implement all perf-stress benchmarks (use React version as reference)
- [ ] Implement CRUD app with routing, state management, forms
- [ ] Implement xterm terminal component
- [ ] Add framework SVG icon to all 3 apps
- [ ] Add the framework to `dashboard/src/main.ts` (apps array + frameworkIcons)
- [ ] Add the framework to `scripts/dev-all.ts` (services array)
- [ ] Add the framework to `e2e/tests/` (perf-stress, crud, xterm test arrays)
- [ ] Add dev scripts to root `package.json`
- [ ] Run `pnpm e2e` to verify all tests pass
- [ ] Run benchmarks and update README results table

## Styling

All apps use Tailwind v4 with `@import "tailwindcss"` in `src/index.css`. Use the same Tailwind classes as the existing apps to keep the UI visually identical across frameworks.

## File Naming

| React | Vue | Svelte | Generic |
|-------|-----|--------|---------|
| `Component.tsx` | `Component.vue` | `Component.svelte` | Match framework convention |
| `useHook.ts` | `composables/useX.ts` | `lib/x.ts` | Framework-idiomatic |
| `store.ts` (Zustand) | `stores/x.ts` (Pinia) | `stores/x.ts` (writable) | Use popular state lib |

## Testing Your Implementation

```bash
# Start your apps
pnpm dev:perf:<framework>
pnpm dev:crud:<framework>    # also needs: pnpm dev:server:json
pnpm dev:xterm:<framework>   # also needs: pnpm dev:server:pty

# Run E2E tests
pnpm e2e

# Run benchmarks
pnpm bench -- --framework <framework>
```
