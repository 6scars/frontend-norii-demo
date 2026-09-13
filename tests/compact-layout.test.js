import assert from 'node:assert/strict'
import test from 'node:test'
import { isCompactLayout } from '../src/shared/hooks/useCompactLayout.js'

test('układ kompaktowy nie wymaga obiektu window podczas renderowania serwerowego', () => {
  assert.equal(isCompactLayout(), false)
})

test('układ kompaktowy odczytuje bieżący breakpoint zamiast zapamiętywać pierwszy rozmiar', (context) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  context.after(() => {
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else delete globalThis.window
  })
  let matches = true
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    matchMedia: (query) => {
      assert.equal(query, '(width < 768px)')
      return { matches }
    },
  } })
  assert.equal(isCompactLayout(), true)
  matches = false
  assert.equal(isCompactLayout(), false)
})
