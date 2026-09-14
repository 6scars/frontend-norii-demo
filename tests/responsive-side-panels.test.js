import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const readSource = (relativePath) => readFileSync(
  fileURLToPath(new URL(`../${relativePath}`, import.meta.url)),
  'utf8',
)

test('header spans the viewport while side panels stay outside the central layout flow', () => {
  const shell = readSource('src/app/AppShell.css')
  const header = readSource('src/widgets/Header/Header.tsx')
  const aside = readSource('src/widgets/Aside/Aside.tsx')

  assert.match(shell, /\.app-shell__header\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s)
  assert.doesNotMatch(shell, /padding-right:\s*calc\(var\(--queue-handle-width\)/)
  assert.match(shell, /@media \(width < 1280px\)[\s\S]*\.app-shell__sidebar\s*\{[^}]*position:\s*fixed/)
  assert.match(header, /className="app-header__brand"/)
  assert.doesNotMatch(aside, /className="brand-mark"/)
})

test('small-screen aside is a toggleable overlay sized independently from the workspace', () => {
  const aside = readSource('src/widgets/Aside/Aside.tsx')
  const styles = readSource('src/widgets/Aside/Aside.css')

  assert.match(aside, /aria-controls="app-navigation"/)
  assert.match(aside, /aria-expanded=\{sidebarOpen\}/)
  assert.match(styles, /@media \(width < 768px\)[\s\S]*--aside-drawer-width:\s*78vw/)
  assert.match(styles, /\.aside-drawer--open\s+\.aside-drawer__surface\s*\{[^}]*transform:\s*translateX\(0\)/s)
})

test('queue uses one compact edge trigger and overlays nearly the full small viewport', () => {
  const queue = readSource('src/widgets/Queue/QueueDrawer.tsx')
  const styles = readSource('src/widgets/Queue/QueueDrawer.css')
  const queueIcons = queue.match(/<Icon name="queue"/g) ?? []

  assert.equal(queueIcons.length, 1)
  assert.doesNotMatch(queue, /queue-drawer__label|queue-drawer__count|chevronLeft/)
  assert.match(styles, /\.queue-drawer__trigger\s*\{[^}]*width:\s*var\(--queue-handle-width\)[^}]*height:\s*var\(--queue-handle-width\)/s)
  assert.doesNotMatch(styles, /queue-drawer--open\s+\.queue-drawer__trigger\s*\{[^}]*visibility:\s*hidden/s)
  assert.match(styles, /@media \(width < 768px\)[\s\S]*\.queue-drawer__surface\s*\{[^}]*width:\s*calc\(100vw - var\(--queue-handle-width\)\)/s)
})

test('queue trigger stays available beside track details and swaps the right panel', () => {
  const shell = readSource('src/app/AppShell.css')
  const queue = readSource('src/widgets/Queue/QueueDrawer.tsx')
  const styles = readSource('src/widgets/Queue/QueueDrawer.css')
  const uiState = readSource('src/modules/UIState/useUIState.ts')

  assert.doesNotMatch(shell, /app-shell--details-open\s*>\s*\.queue-drawer\s*\{[^}]*visibility:\s*hidden/s)
  assert.match(queue, /queue-drawer--details-open/)
  assert.match(queue, /if \(nextOpen\)\s*\{[^}]*closeTrackDetails\(\)/s)
  assert.match(uiState, /openTrackDetails\s*=\s*useCallback\(\(\)\s*=>\s*\{[^}]*setQueueOpen\(false\)[^}]*setTrackDetailsOpen\(true\)/s)
  assert.match(styles, /\.queue-drawer--details-open\s+\.queue-drawer__trigger\s*\{[^}]*right:\s*min\(var\(--description-width\),\s*38vw\)/s)
  assert.match(styles, /@media \(width < 768px\)[\s\S]*\.queue-drawer--details-open\s+\.queue-drawer__trigger\s*\{[^}]*right:\s*var\(--space-3\)/s)
})
