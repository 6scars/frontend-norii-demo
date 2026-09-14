import assert from 'node:assert/strict'
import test from 'node:test'
import { isCompactLayout } from '../src/shared/hooks/useCompactLayout.ts'

await test('układ kompaktowy nie wymaga obiektu window podczas renderowania serwerowego', () => {
  assert.equal(isCompactLayout(), false)
})

await test('układ kompaktowy odczytuje bieżący breakpoint zamiast zapamiętywać pierwszy rozmiar', (context) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  context.after(() => {
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else Reflect.deleteProperty(globalThis, 'window')
  })
  let matches = true
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    matchMedia: (query: string) => {
      assert.equal(query, '(width < 768px)')
      return { matches }
    },
  } })
  assert.equal(isCompactLayout(), true)
  matches = false
  assert.equal(isCompactLayout(), false)
})
