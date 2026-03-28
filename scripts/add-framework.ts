/**
 * Scaffold script for adding a new framework to the JS Framework Comparison project.
 *
 * Usage:
 *   tsx scripts/add-framework.ts <framework-name>
 *
 * Example:
 *   tsx scripts/add-framework.ts solid
 *
 * This will create:
 *   apps/perf-stress/<name>/  (port 51xx)
 *   apps/crud/<name>/         (port 52xx)
 *   apps/xterm/<name>/        (port 53xx)
 */

import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

// ---------------------------------------------------------------------------
// CLI argument
// ---------------------------------------------------------------------------

const name = process.argv[2]?.toLowerCase()

if (!name) {
  console.error('Usage: tsx scripts/add-framework.ts <framework-name>')
  console.error('Example: tsx scripts/add-framework.ts solid')
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(`Invalid framework name "${name}". Use lowercase letters, digits, and hyphens.`)
  process.exit(1)
}

const Name = name.charAt(0).toUpperCase() + name.slice(1) // "solid" -> "Solid"

// ---------------------------------------------------------------------------
// Port assignment
// ---------------------------------------------------------------------------

const KNOWN_FRAMEWORKS = ['react', 'vue', 'svelte'] // slots 01, 02, 03

function getNextSlot(): number {
  const existing = readdirSync(join(ROOT, 'apps/perf-stress'))
  const allFrameworks = [...KNOWN_FRAMEWORKS]
  for (const dir of existing) {
    if (!allFrameworks.includes(dir)) {
      allFrameworks.push(dir)
    }
  }
  // If the framework already exists, reuse its slot
  const idx = allFrameworks.indexOf(name)
  if (idx !== -1) return idx + 1
  return allFrameworks.length + 1
}

const slot = getNextSlot()
const slotStr = String(slot).padStart(2, '0')

const ports = {
  perf: Number(`51${slotStr}`),
  crud: Number(`52${slotStr}`),
  xterm: Number(`53${slotStr}`),
}

// Check if directories already exist
for (const appType of ['perf-stress', 'crud', 'xterm'] as const) {
  const dir = join(ROOT, 'apps', appType, name)
  if (existsSync(dir)) {
    console.error(`Directory already exists: apps/${appType}/${name}/`)
    console.error('Remove it first if you want to re-scaffold.')
    process.exit(1)
  }
}

// ---------------------------------------------------------------------------
// File writers
// ---------------------------------------------------------------------------

function writeFile(relPath: string, content: string) {
  const abs = join(ROOT, relPath)
  mkdirSync(join(abs, '..'), { recursive: true })
  writeFileSync(abs, content, 'utf-8')
  console.log(`  created ${relPath}`)
}

// ---------------------------------------------------------------------------
// Shared templates
// ---------------------------------------------------------------------------

function packageJson(appType: string, portKey: keyof typeof ports): string {
  const prefix = appType === 'perf-stress' ? 'perf' : appType
  return JSON.stringify(
    {
      name: `@comparison/${prefix}-${name}`,
      private: true,
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        // TODO: Add framework-specific dependencies
      },
      devDependencies: {
        vite: '^6.2.0',
        tailwindcss: '^4.2.0',
        '@tailwindcss/vite': '^4.2.0',
        typescript: '^5.8.0',
        // TODO: Add framework-specific vite plugin
      },
    },
    null,
    2,
  ) + '\n'
}

function viteConfig(portKey: keyof typeof ports): string {
  const port = ports[portKey]
  return `import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// TODO: Import and add the ${Name} vite plugin
// Example: import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    // TODO: Add ${name} plugin here, e.g. solid()
    tailwindcss(),
  ],
  server: { port: ${port}, strictPort: true },
  preview: { port: ${port}, strictPort: true },
})
`
}

function tsconfig(): string {
  return JSON.stringify(
    {
      extends: '../../../tsconfig.base.json',
      compilerOptions: {
        // TODO: Set the correct JSX mode for ${Name}
        // React: "react-jsx", Solid: "preserve" with jsxImportSource, etc.
        jsx: 'preserve',
        baseUrl: '.',
        outDir: 'dist',
      },
      include: ['src'],
    },
    null,
    2,
  ) + '\n'
}

function indexHtml(title: string, entryFile: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${Name}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/${entryFile}"></script>
</body>
</html>
`
}

// ---------------------------------------------------------------------------
// Perf-stress app
// ---------------------------------------------------------------------------

function scaffoldPerfStress() {
  const base = `apps/perf-stress/${name}`

  writeFile(`${base}/package.json`, packageJson('perf-stress', 'perf'))
  writeFile(`${base}/vite.config.ts`, viteConfig('perf'))
  writeFile(`${base}/tsconfig.json`, tsconfig())
  writeFile(`${base}/index.html`, indexHtml('Perf Stress', 'main.tsx'))

  // src/main.tsx
  writeFile(
    `${base}/src/main.tsx`,
    `// TODO: Replace with ${Name}'s render/mount API
// See apps/perf-stress/react/src/main.tsx for reference

import './index.css'

// Example for React:
//   import { createRoot } from 'react-dom/client'
//   import App from './App'
//   createRoot(document.getElementById('root')!).render(<App />)

// TODO: Mount App component to #root using ${Name}'s API
console.log('${Name} perf-stress app — not yet implemented')
`,
  )

  // src/index.css
  writeFile(
    `${base}/src/index.css`,
    `@import "tailwindcss";
`,
  )

  // src/App.tsx
  writeFile(
    `${base}/src/App.tsx`,
    `// TODO: Implement using ${Name}'s component system
// See apps/perf-stress/react/src/App.tsx for reference
//
// This component provides 3 tabs:
//   1. List Operations (LargeList)
//   2. Deep Tree (DeepTree)
//   3. Rapid Counter (RapidCounter)
//
// Each tab shows a benchmark component and a ResultsTable.

export default function App() {
  // TODO: Implement tab state using ${Name}'s reactive state system
  // TODO: Render tab navigation + active benchmark component + ResultsTable
  return null
}
`,
  )

  // src/components/LargeList.tsx
  writeFile(
    `${base}/src/components/LargeList.tsx`,
    `// TODO: Implement using ${Name}'s reactive state system
// See apps/perf-stress/react/src/components/LargeList.tsx for reference
//
// 10,000 row table benchmark with operations:
//   - Create 10k rows
//   - Update every 10th row
//   - Swap rows (index 1 <-> 998)
//   - Select row (highlight)
//   - Append 1k rows
//   - Clear all rows
//
// Must use shared utilities:
//   import { runTimed, buildData, resetId } from '../../../../shared/bench-utils'
//
// Must expose results on window:
//   (window as any).__BENCH_RESULTS__ = results

export default function LargeList() {
  // TODO: Implement using ${Name}'s reactive state system
  return null
}
`,
  )

  // src/components/DeepTree.tsx
  writeFile(
    `${base}/src/components/DeepTree.tsx`,
    `// TODO: Implement using ${Name}'s component system
// See apps/perf-stress/react/src/components/DeepTree.tsx for reference
//
// Recursive component rendering 500 levels deep.
// Tests framework overhead for deep component trees.
//
// Must use:
//   import { runTimed } from '../../../../shared/bench-utils'
//
// Must expose results on window:
//   (window as any).__BENCH_RESULTS__ = results

export default function DeepTree() {
  // TODO: Implement recursive tree node using ${Name}'s component system
  return null
}
`,
  )

  // src/components/RapidCounter.tsx
  writeFile(
    `${base}/src/components/RapidCounter.tsx`,
    `// TODO: Implement using ${Name}'s reactive state system
// See apps/perf-stress/react/src/components/RapidCounter.tsx for reference
//
// A counter driven by requestAnimationFrame loop.
// Measures how many frames the framework can process per second.
//
// Must expose results on window:
//   (window as any).__BENCH_RESULTS__ = results

export default function RapidCounter() {
  // TODO: Implement rAF loop counter using ${Name}'s reactive state system
  return null
}
`,
  )

  // src/components/ResultsTable.tsx
  writeFile(
    `${base}/src/components/ResultsTable.tsx`,
    `// TODO: Implement using ${Name}'s component system
// See apps/perf-stress/react/src/components/ResultsTable.tsx for reference
//
// Displays benchmark results in a table.
// Receives results data as props.

export default function ResultsTable(/* TODO: define props */) {
  // TODO: Render a table of benchmark results
  return null
}
`,
  )
}

// ---------------------------------------------------------------------------
// CRUD app
// ---------------------------------------------------------------------------

function scaffoldCrud() {
  const base = `apps/crud/${name}`

  writeFile(`${base}/package.json`, packageJson('crud', 'crud'))
  writeFile(`${base}/vite.config.ts`, viteConfig('crud'))
  writeFile(`${base}/tsconfig.json`, tsconfig())
  writeFile(`${base}/index.html`, indexHtml('CRUD', 'main.tsx'))

  // src/main.tsx
  writeFile(
    `${base}/src/main.tsx`,
    `// TODO: Replace with ${Name}'s render/mount API + router setup
// See apps/crud/react/src/main.tsx for reference

import './index.css'

// TODO: Mount App with router to #root using ${Name}'s API
console.log('${Name} CRUD app — not yet implemented')
`,
  )

  // src/index.css
  writeFile(
    `${base}/src/index.css`,
    `@import "tailwindcss";
`,
  )

  // src/App.tsx
  writeFile(
    `${base}/src/App.tsx`,
    `// TODO: Implement using ${Name}'s component + routing system
// See apps/crud/react/src/App.tsx for reference
//
// Root layout with:
//   - Nav bar (with framework icon)
//   - Router outlet for pages

export default function App() {
  // TODO: Implement layout with nav bar and router outlet
  return null
}
`,
  )

  // src/api.ts
  writeFile(
    `${base}/src/api.ts`,
    `// API layer for the CRUD app
// See apps/crud/react/src/api.ts for reference
//
// Base URL: http://localhost:3100

const BASE = 'http://localhost:3100'

// TODO: Implement these API functions:

export async function fetchTasks(params?: {
  status?: string
  category?: string
  sort?: string
  search?: string
  page?: number
  limit?: number
}) {
  // TODO: Build query string from params, fetch from \${BASE}/tasks
  throw new Error('Not implemented')
}

export async function fetchTask(id: string) {
  // TODO: GET \${BASE}/tasks/\${id}
  throw new Error('Not implemented')
}

export async function createTask(data: Record<string, unknown>) {
  // TODO: POST \${BASE}/tasks
  throw new Error('Not implemented')
}

export async function updateTask(id: string, data: Record<string, unknown>) {
  // TODO: PATCH \${BASE}/tasks/\${id}
  throw new Error('Not implemented')
}

export async function deleteTask(id: string) {
  // TODO: DELETE \${BASE}/tasks/\${id}
  throw new Error('Not implemented')
}

export async function fetchCategories() {
  // TODO: GET \${BASE}/categories
  throw new Error('Not implemented')
}
`,
  )

  // src/pages/Home.tsx
  writeFile(
    `${base}/src/pages/Home.tsx`,
    `// TODO: Implement dashboard home page using ${Name}
// See apps/crud/react/src/pages/Home.tsx for reference
//
// Shows summary stats and links to tasks.

export default function Home() {
  // TODO: Implement dashboard with task stats
  return null
}
`,
  )

  // src/pages/Tasks.tsx
  writeFile(
    `${base}/src/pages/Tasks.tsx`,
    `// TODO: Implement task list page using ${Name}
// See apps/crud/react/src/pages/Tasks.tsx for reference
//
// Features:
//   - Filter by status, category
//   - Sort (date, priority)
//   - Search
//   - Pagination
//   - Delete with confirmation

export default function Tasks() {
  // TODO: Implement task list with filters, sort, search, pagination
  return null
}
`,
  )

  // src/pages/TaskCreate.tsx
  writeFile(
    `${base}/src/pages/TaskCreate.tsx`,
    `// TODO: Implement task creation page using ${Name}
// See apps/crud/react/src/pages/TaskCreate.tsx for reference
//
// Form with Zod validation for:
//   - title (required)
//   - description
//   - status (todo/in-progress/done)
//   - category
//   - priority (low/medium/high)
//   - due date

export default function TaskCreate() {
  // TODO: Implement form with Zod validation
  return null
}
`,
  )

  // src/pages/TaskEdit.tsx
  writeFile(
    `${base}/src/pages/TaskEdit.tsx`,
    `// TODO: Implement task edit page using ${Name}
// See apps/crud/react/src/pages/TaskEdit.tsx for reference
//
// Same form as TaskCreate but pre-filled with existing task data.
// Uses route params to fetch task by ID.

export default function TaskEdit() {
  // TODO: Fetch task by route param ID, render edit form with Zod validation
  return null
}
`,
  )

  // src/components/Nav.tsx
  writeFile(
    `${base}/src/components/Nav.tsx`,
    `// TODO: Implement nav bar using ${Name}
// See apps/crud/react/src/components/Nav.tsx for reference
//
// Navigation bar with:
//   - Framework icon/name
//   - Links: Home, Tasks, New Task

export default function Nav() {
  // TODO: Implement nav with framework icon and route links
  return null
}
`,
  )
}

// ---------------------------------------------------------------------------
// Xterm app
// ---------------------------------------------------------------------------

function scaffoldXterm() {
  const base = `apps/xterm/${name}`

  writeFile(`${base}/package.json`, packageJson('xterm', 'xterm'))
  writeFile(`${base}/vite.config.ts`, viteConfig('xterm'))
  writeFile(`${base}/tsconfig.json`, tsconfig())
  writeFile(`${base}/index.html`, indexHtml('Terminal', 'main.tsx'))

  // src/main.tsx
  writeFile(
    `${base}/src/main.tsx`,
    `// TODO: Replace with ${Name}'s render/mount API
// See apps/xterm/react/src/main.tsx for reference

import './index.css'

// TODO: Mount App to #root using ${Name}'s API
console.log('${Name} xterm app — not yet implemented')
`,
  )

  // src/index.css
  writeFile(
    `${base}/src/index.css`,
    `@import "tailwindcss";
`,
  )

  // src/App.tsx
  writeFile(
    `${base}/src/App.tsx`,
    `// TODO: Implement using ${Name}'s component system
// See apps/xterm/react/src/App.tsx for reference
//
// Main layout containing:
//   - Header with framework name + connection status indicator
//   - Terminal component

export default function App() {
  // TODO: Implement layout with connection status and Terminal component
  return null
}
`,
  )

  // src/components/Terminal.tsx
  writeFile(
    `${base}/src/components/Terminal.tsx`,
    `// TODO: Implement terminal component using ${Name}
// See apps/xterm/react/src/components/Terminal.tsx for reference
//
// Requirements:
//   - Wrap @xterm/xterm with FitAddon, SearchAddon, WebLinksAddon
//   - Connect via WebSocket to ws://localhost:3200
//   - Report connection status to parent (connected/disconnected/error)
//   - IMPORTANT: 200ms delay before fit() and WebSocket connect (xterm v5 quirk)
//
// Lifecycle:
//   1. Create Terminal instance and attach to DOM element
//   2. Load addons (FitAddon, SearchAddon, WebLinksAddon)
//   3. After 200ms delay: call fitAddon.fit(), open WebSocket
//   4. Pipe terminal.onData -> ws.send, ws.onmessage -> terminal.write
//   5. On unmount: dispose terminal, close WebSocket
//
// Dependencies (already in package.json):
//   import { Terminal as XTerm } from '@xterm/xterm'
//   import { FitAddon } from '@xterm/addon-fit'
//   import { SearchAddon } from '@xterm/addon-search'
//   import { WebLinksAddon } from '@xterm/addon-web-links'
//   import '@xterm/xterm/css/xterm.css'

export default function TerminalComponent() {
  // TODO: Implement using ${Name}'s lifecycle hooks and refs
  return null
}
`,
  )
}

// ---------------------------------------------------------------------------
// Run scaffolding
// ---------------------------------------------------------------------------

console.log('')
console.log(`Scaffolding "${Name}" framework (slot ${slotStr})...`)
console.log(`  Ports: perf=${ports.perf}, crud=${ports.crud}, xterm=${ports.xterm}`)
console.log('')

scaffoldPerfStress()
console.log('')
scaffoldCrud()
console.log('')
scaffoldXterm()

// ---------------------------------------------------------------------------
// Print manual checklist
// ---------------------------------------------------------------------------

console.log('')
console.log('='.repeat(64))
console.log(`  Scaffolding complete for "${Name}"!`)
console.log('='.repeat(64))
console.log('')
console.log('Manual steps remaining:')
console.log('')
console.log(`  1. Install framework dependencies in each app:`)
console.log(`     - apps/perf-stress/${name}/package.json`)
console.log(`     - apps/crud/${name}/package.json`)
console.log(`     - apps/xterm/${name}/package.json`)
console.log(`     Then run: pnpm install`)
console.log('')
console.log(`  2. Update vite.config.ts in each app:`)
console.log(`     - Import the ${Name} vite plugin`)
console.log(`     - Add it to the plugins array`)
console.log('')
console.log(`  3. Update tsconfig.json in each app:`)
console.log(`     - Set the correct "jsx" compiler option for ${Name}`)
console.log(`     - Add "jsxImportSource" if needed`)
console.log('')
console.log(`  4. Implement all TODO components:`)
console.log(`     Perf-stress (apps/perf-stress/${name}/src/):`)
console.log(`       - main.tsx          Mount the app`)
console.log(`       - App.tsx           Tab navigation (List, DeepTree, Counter)`)
console.log(`       - LargeList.tsx     10k row benchmark`)
console.log(`       - DeepTree.tsx      500-level recursive tree`)
console.log(`       - RapidCounter.tsx  rAF loop counter`)
console.log(`       - ResultsTable.tsx  Benchmark results display`)
console.log('')
console.log(`     CRUD (apps/crud/${name}/src/):`)
console.log(`       - main.tsx          Mount with router`)
console.log(`       - App.tsx           Layout + router outlet`)
console.log(`       - api.ts            HTTP client (already stubbed)`)
console.log(`       - pages/Home.tsx    Dashboard`)
console.log(`       - pages/Tasks.tsx   List with filters/sort/search/pagination`)
console.log(`       - pages/TaskCreate  Form with Zod validation`)
console.log(`       - pages/TaskEdit    Edit form`)
console.log(`       - components/Nav    Framework-branded nav bar`)
console.log('')
console.log(`     Xterm (apps/xterm/${name}/src/):`)
console.log(`       - main.tsx              Mount the app`)
console.log(`       - App.tsx               Layout + connection status`)
console.log(`       - components/Terminal    xterm.js + WebSocket (200ms delay!)`)
console.log('')
console.log(`  5. Update the dashboard (dashboard/src/main.ts):`)
console.log(`     a. Add '${name}' to the AppEntry framework union type`)
console.log(`     b. Add entries to the apps array:`)
console.log(`        { name: '${Name} Perf',     port: ${ports.perf}, framework: '${name}', type: 'perf',  description: '...' },`)
console.log(`        { name: '${Name} CRUD',     port: ${ports.crud}, framework: '${name}', type: 'crud',  description: '...' },`)
console.log(`        { name: '${Name} Terminal', port: ${ports.xterm}, framework: '${name}', type: 'xterm', description: '...' },`)
console.log(`     c. Add a frameworkIcons['${name}'] entry with SVG icon and color`)
console.log(`     d. Update the grid from grid-cols-3 to grid-cols-4`)
console.log('')
console.log(`  6. Update scripts/dev-all.ts:`)
console.log(`     Add 3 entries to the services array:`)
console.log(`        { name: 'perf-${name}',  filter: '@comparison/perf-${name}',  color: '\\x1b[35m' },`)
console.log(`        { name: 'crud-${name}',  filter: '@comparison/crud-${name}',  color: '\\x1b[35m' },`)
console.log(`        { name: 'xterm-${name}', filter: '@comparison/xterm-${name}', color: '\\x1b[35m' },`)
console.log('')
console.log(`  7. Add xterm dependencies to apps/xterm/${name}/package.json:`)
console.log(`     "@xterm/xterm": "^5.5.0"`)
console.log(`     "@xterm/addon-fit": "^0.10.0"`)
console.log(`     "@xterm/addon-search": "^0.15.0"`)
console.log(`     "@xterm/addon-web-links": "^0.11.0"`)
console.log('')
console.log(`  8. Add CRUD-specific dependencies to apps/crud/${name}/package.json:`)
console.log(`     "zod": "^3.23.0"`)
console.log(`     Plus ${Name}'s router, state management, and form libraries`)
console.log('')
console.log(`  9. Verify everything works:`)
console.log(`     pnpm install`)
console.log(`     pnpm --filter @comparison/perf-${name} dev`)
console.log(`     pnpm --filter @comparison/crud-${name} dev`)
console.log(`     pnpm --filter @comparison/xterm-${name} dev`)
console.log('')
