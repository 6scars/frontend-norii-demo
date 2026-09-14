import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const styles = readFileSync(
  fileURLToPath(new URL('../src/widgets/AddSong/AddSong.css', import.meta.url)),
  'utf8',
)

await test('widok dodawania utworu przewija wysoki krok bez chowania treści', () => {
  assert.match(styles, /\.song-upload\s*\{[^}]*height:\s*100dvh/s)
  assert.match(styles, /\.song-upload__workspace\s*\{[^}]*height:\s*100dvh[^}]*grid-template-rows:\s*auto\s+minmax\(min-content,\s*1fr\)\s+auto[^}]*overflow-y:\s*auto/s)
})

await test('dropdown albumu zachowuje ciemny wygląd aplikacji', () => {
  assert.match(styles, /\.upload-details select\s*\{[^}]*color-scheme:\s*dark[^}]*cursor:\s*pointer/s)
  assert.match(styles, /\.upload-details select option\s*\{[^}]*background:\s*#0d0d10[^}]*color:\s*var\(--color-text\)/s)
})

await test('sam kwadrat checkboxa pokazuje kursor interakcji', () => {
  assert.match(styles, /\.upload-review__consents input\s*\{[^}]*cursor:\s*pointer/s)
})
