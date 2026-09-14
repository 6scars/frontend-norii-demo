import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const homePageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Home/HomePage.tsx', import.meta.url)),
  'utf8',
)

test('Home pokazuje rząd Ostatnie przed rzędem Wybrane dla Ciebie', () => {
  const recentShelfPosition = homePageSource.indexOf('songs={model.recent}')
  const selectedShelfPosition = homePageSource.indexOf('songs={model.selected}')

  assert.notEqual(recentShelfPosition, -1)
  assert.notEqual(selectedShelfPosition, -1)
  assert.ok(recentShelfPosition < selectedShelfPosition)
  assert.match(homePageSource, /title="Ostatnie"/)
  assert.match(homePageSource, /title="Wybrane dla Ciebie"/)
})
