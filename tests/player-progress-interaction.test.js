import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const playerProgressCss = readFileSync(
  new URL('../src/widgets/Play/PlayCenterSection.css', import.meta.url),
  'utf8',
)
const playerProgressComponent = readFileSync(
  new URL('../src/widgets/Play/PlayCenterSection.jsx', import.meta.url),
  'utf8',
)

test('kropka jest widoczna tylko podczas przytrzymania progress bara', () => {
  assert.match(
    playerProgressCss,
    /\.player-progress__input--engaged::-webkit-slider-thumb[\s\S]*?opacity:\s*1/,
  )
  assert.match(
    playerProgressComponent,
    /onPointerDown=\{beginProgressInteraction\}/,
  )
  assert.match(playerProgressComponent, /onPointerUp=\{endProgressInteraction\}/)
  assert.match(playerProgressComponent, /onPointerCancel=\{endProgressInteraction\}/)
  assert.doesNotMatch(playerProgressComponent, /document\.addEventListener\('pointerdown'/)
  assert.doesNotMatch(playerProgressCss, /\.player-progress__input:hover/)
})

test('aktywny progress bar powiększa pasek i kropkę', () => {
  assert.match(
    playerProgressCss,
    /\.player-progress__input--engaged::-webkit-slider-runnable-track[\s\S]*?height:\s*8px/,
  )
  assert.match(
    playerProgressCss,
    /\.player-progress__input--engaged::-webkit-slider-thumb[\s\S]*?width:\s*14px[\s\S]*?height:\s*14px/,
  )
})
