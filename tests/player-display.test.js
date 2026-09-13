import assert from 'node:assert/strict'
import test from 'node:test'

import { formatPlayerTime, getPlayerProgress } from '../src/modules/Player/player-display.js'

test('czas odtwarzacza jest odporny na brak i ujemne dane', () => {
  assert.equal(formatPlayerTime(Number.NaN), '0:00')
  assert.equal(formatPlayerTime(-4), '0:00')
  assert.equal(formatPlayerTime(65.9), '1:05')
})

test('postęp odtwarzacza zawsze mieści się od zera do stu procent', () => {
  assert.equal(getPlayerProgress(25, 100), 25)
  assert.equal(getPlayerProgress(-10, 100), 0)
  assert.equal(getPlayerProgress(120, 100), 100)
  assert.equal(getPlayerProgress(20, 0), 0)
})
