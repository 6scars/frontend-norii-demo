import assert from 'node:assert/strict'
import test from 'node:test'

import { clampVolume } from '../src/modules/Player/player-audio.ts'

await test('głośność jest ograniczana do zakresu elementu audio', () => {
  assert.equal(clampVolume(-0.4), 0)
  assert.equal(clampVolume(0.35), 0.35)
  assert.equal(clampVolume(1.8), 1)
  assert.equal(clampVolume(Number.NaN), 0)
  assert.equal(clampVolume(Number.POSITIVE_INFINITY), 0)
})
