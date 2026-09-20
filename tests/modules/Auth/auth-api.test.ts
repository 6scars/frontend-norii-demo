import assert from 'node:assert/strict'
import test from 'node:test'

import { authenticate, validateSession } from '../../../src/modules/Auth/auth-api.ts'
import { parseRequestBody, requestUrl } from '../../test-helpers/http/fetch.ts'

await test('walidacja bez tokenu kończy się bez żądania sieciowego', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = () => Promise.reject(new Error('fetch should not be called'))

  assert.equal(await validateSession(null), false)
})

await test('uwierzytelnianie wybiera endpoint na podstawie trybu formularza', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url, options) => {
    assert.match(requestUrl(url), /\/api\/newAccount$/)
    assert.deepEqual(parseRequestBody(options), { email: 'user@example.com', password: 'secret' })
    return Promise.resolve(new Response(JSON.stringify({ message: 'Konto utworzone' }), { status: 200 }))
  }

  const payload = await authenticate('signup', { email: 'user@example.com', password: 'secret' })

  assert.equal(payload.message, 'Konto utworzone')
})
