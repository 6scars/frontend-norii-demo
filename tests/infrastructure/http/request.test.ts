import assert from 'node:assert/strict'
import test from 'node:test'

import { BACKEND_URL } from '../../../src/config.ts'
import { ApiError, requestJson } from '../../../src/shared/api/request.ts'

await test('requestJson koduje body JSON i zwraca zdekodowaną odpowiedź', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url, options) => {
    assert.equal(url, BACKEND_URL + '/api/example')
    assert.equal(options?.method, 'POST')
    assert.equal(new Headers(options?.headers).get('Content-Type'), 'application/json')
    assert.equal(options?.body, JSON.stringify({ name: 'Test' }))
    return Promise.resolve(new Response(JSON.stringify({ data: { id: 1 } }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }))
  }

  const payload = await requestJson('/api/example', {
    json: { name: 'Test' },
    method: 'POST',
  })

  assert.deepEqual(payload, { data: { id: 1 } })
})

await test('requestJson dołącza token tylko do żądania uwierzytelnionego', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (_url, options) => {
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer token-123')
    return Promise.resolve(new Response(null, { status: 204 }))
  }

  const payload = await requestJson('/api/private', { token: 'token-123' })

  assert.equal(payload, null)
})

await test('requestJson zwraca ujednolicony błąd z komunikatem backendu', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = () => Promise.resolve(new Response(JSON.stringify({ message: 'Brak dostępu' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 403,
  }))

  await assert.rejects(
    requestJson('/api/private'),
    (error) => error instanceof ApiError && error.status === 403 && error.message === 'Brak dostępu',
  )
})

await test('requestJson odrzuca niepoprawną odpowiedź JSON', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = () => Promise.resolve(new Response('not-json', { status: 200 }))

  await assert.rejects(
    requestJson('/api/example'),
    (error) => error instanceof ApiError && error.message === 'Serwer zwrócił nieprawidłową odpowiedź',
  )
})
