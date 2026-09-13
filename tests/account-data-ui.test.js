import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const dataPageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Account/Settings/AccountData/AccountDataPage.jsx', import.meta.url)),
  'utf8',
)
const settingsPageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Account/Settings/SettingsPage.jsx', import.meta.url)),
  'utf8',
)
const accountPageSource = readFileSync(
  fileURLToPath(new URL('../src/pages/Account/AccountPage.jsx', import.meta.url)),
  'utf8',
)
const accountMenuSource = readFileSync(
  fileURLToPath(new URL('../src/widgets/Signing/AccountOptions/AccountOptions.jsx', import.meta.url)),
  'utf8',
)

test('ustawienia prowadzą do widoku danych konta', () => {
  assert.match(settingsPageSource, /to=\{APP_ROUTES\.accountData\}/)
  assert.match(settingsPageSource, />Dane</)
})

test('konto prowadzi do ustawień zagnieżdżonych w sekcji konta', () => {
  assert.match(accountPageSource, /to=\{APP_ROUTES\.accountSettings\}/)
})

test('menu konta prowadzi do zagnieżdżonych ustawień', () => {
  assert.match(accountMenuSource, /goTo\(APP_ROUTES\.accountSettings\)/)
  assert.doesNotMatch(accountMenuSource, /APP_ROUTES\.settings/)
})

test('widok danych udostępnia opisane pole nazwy użytkownika i status zapisu', () => {
  assert.match(dataPageSource, /<label htmlFor="username">Nazwa użytkownika<\/label>/)
  assert.match(dataPageSource, /<input[^>]*id="username"[^>]*name="username"/s)
  assert.match(dataPageSource, /aria-live="polite"/)
})
