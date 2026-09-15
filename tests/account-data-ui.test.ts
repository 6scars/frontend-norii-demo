import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const dataPageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Account/Settings/AccountData/AccountDataPage.tsx', import.meta.url)),
  'utf8',
)
const settingsPageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Account/Settings/SettingsPage.tsx', import.meta.url)),
  'utf8',
)
const accountPageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Account/AccountPage.tsx', import.meta.url)),
  'utf8',
)
const accountMenuSource = readFileSync(
  fileURLToPath(new URL('../src/widgets/Signing/AccountOptions/AccountOptions.tsx', import.meta.url)),
  'utf8',
)

await test('ustawienia prowadzą do widoku danych konta', () => {
  assert.match(settingsPageSource, /to=\{APP_ROUTES\.accountData\}/)
  assert.match(settingsPageSource, />Dane</)
})

await test('konto prowadzi do ustawień zagnieżdżonych w sekcji konta', () => {
  assert.match(accountPageSource, /to=\{APP_ROUTES\.accountSettings\}/)
})

await test('menu konta prowadzi do zagnieżdżonych ustawień', () => {
  assert.match(accountMenuSource, /goTo\(APP_ROUTES\.accountSettings\)/)
  assert.doesNotMatch(accountMenuSource, /APP_ROUTES\.settings/)
})

await test('widok danych udostępnia opisane pole nazwy użytkownika i status zapisu', () => {
  assert.match(dataPageSource, /<label htmlFor="username">Nazwa użytkownika<\/label>/)
  assert.match(dataPageSource, /<input[^>]*id="username"[^>]*name="username"/s)
  assert.match(dataPageSource, /aria-live="polite"/)
})
