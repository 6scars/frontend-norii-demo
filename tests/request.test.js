import assert from 'node:assert/strict'
import test from 'node:test'

import { BACKEND_URL } from '../src/config.js'
import { ApiError, requestJson } from '../src/shared/api/request.js'

test('requestJson koduje body JSON i zwraca zdekodowaną odpowiedź', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url, options) => {
    assert.equal(url, BACKEND_URL + '/api/example')
    assert.equal(options.method, 'POST')
    assert.equal(options.headers.get('Content-Type'), 'application/json')
    assert.equal(options.body, JSON.stringify({ name: 'Test' }))
    return new Response(JSON.stringify({ data: { id: 1 } }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  const payload = await requestJson('/api/example', {
    json: { name: 'Test' },
    method: 'POST',
  })

  assert.deepEqual(payload, { data: { id: 1 } })
})

test('requestJson dołącza token tylko do żądania uwierzytelnionego', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.get('Authorization'), 'Bearer token-123')
    return new Response(null, { status: 204 })
  }

  const payload = await requestJson('/api/private', { token: 'token-123' })

  assert.equal(payload, null)
})

test('requestJson zwraca ujednolicony błąd z komunikatem backendu', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'Brak dostępu' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 403,
  })

  await assert.rejects(
    requestJson('/api/private'),
    (error) => error instanceof ApiError && error.status === 403 && error.message === 'Brak dostępu',
  )
})

test('requestJson odrzuca niepoprawną odpowiedź JSON', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async () => new Response('not-json', { status: 200 })

  await assert.rejects(
    requestJson('/api/example'),
    (error) => error instanceof ApiError && error.message === 'Serwer zwrócił nieprawidłową odpowiedź',
  )
})
