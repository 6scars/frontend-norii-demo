import assert from 'node:assert/strict'
import test from 'node:test'

import {
  clampSheetHeight,
  resolveSheetSnap,
  SHEET_SNAP,
} from '../src/widgets/Center/hooks/useDescriptionSheet.js'

test('wysokość panelu pozostaje pomiędzy dwoma punktami zatrzymania', () => {
  assert.equal(clampSheetHeight(120, 300, 600), 300)
  assert.equal(clampSheetHeight(460, 300, 600), 460)
  assert.equal(clampSheetHeight(840, 300, 600), 600)
})

test('szybki gest wybiera kierunek niezależnie od połowy wysokości', () => {
  assert.equal(resolveSheetSnap({ height: 380, minHeight: 300, maxHeight: 600, velocityY: -0.6 }), SHEET_SNAP.expanded)
  assert.equal(resolveSheetSnap({ height: 540, minHeight: 300, maxHeight: 600, velocityY: 0.6 }), SHEET_SNAP.collapsed)
})

test('wolny gest zatrzymuje panel w najbliższym punkcie', () => {
  assert.equal(resolveSheetSnap({ height: 430, minHeight: 300, maxHeight: 600, velocityY: 0 }), SHEET_SNAP.collapsed)
  assert.equal(resolveSheetSnap({ height: 470, minHeight: 300, maxHeight: 600, velocityY: 0 }), SHEET_SNAP.expanded)
})
