import assert from 'node:assert/strict'
import test from 'node:test'

import { updateUsername } from '../../../src/modules/Account/account-api.ts'
import { parseRequestBody, requestUrl } from '../../test-helpers/http/fetch.ts'

await test('aktualizacja nazwy użytkownika zachowuje kontrakt backendu', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url, options) => {
    assert.match(requestUrl(url), /\/api\/updateUsername$/)
    assert.equal(options?.method, 'POST')
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer profile-token')
    assert.deepEqual(parseRequestBody(options), { username: 'Nowa nazwa' })
    return Promise.resolve(new Response(JSON.stringify({ message: 'Zapisano' }), { status: 200 }))
  }

  const payload = await updateUsername('  Nowa nazwa  ', 'profile-token')

  assert.deepEqual(payload, { message: 'Zapisano' })
})

await test('aktualizacja nazwy użytkownika odrzuca pustą wartość bez żądania', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = () => Promise.reject(new Error('fetch should not be called'))

  await assert.rejects(updateUsername('   ', 'profile-token'), /Nazwa użytkownika jest wymagana/)
})

await test('aktualizacja nazwy użytkownika odrzuca wartość dłuższą niż limit', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = () => Promise.reject(new Error('fetch should not be called'))

  await assert.rejects(updateUsername('a'.repeat(51), 'profile-token'), /maksymalnie 50 znaków/)
})
