import assert from 'node:assert/strict'
import { test } from 'node:test'

import { deleteMySong, fetchMySongs } from '../src/modules/MySongs/my-songs-api.js'

test('pobiera własne utwory z tokenem i kursorem', async () => {
  const originalFetch = globalThis.fetch
  let request
  let url
  globalThis.fetch = async (nextUrl, options) => {
    url = nextUrl
    request = options
    return new Response(JSON.stringify({ data: [{ id: '9', songName: 'Cienie' }], nextCursor: '9' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const result = await fetchMySongs('signed-token', '12')
    assert.match(url, /\/api\/my-songs\?cursor=12$/)
    assert.equal(new Headers(request.headers).get('Authorization'), 'Bearer signed-token')
    assert.deepEqual(result, {
      data: [{ id: '9', songName: 'Cienie', songImage: null, credit: null, createdAt: null, views: 0 }],
      nextCursor: '9',
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('usuwa wybrany własny utwór przez DELETE z tokenem', async () => {
  const originalFetch = globalThis.fetch
  let request
  let url
  globalThis.fetch = async (nextUrl, options) => {
    url = nextUrl
    request = options
    return new Response(JSON.stringify({ message: 'Utwór został usunięty.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await deleteMySong('9', 'signed-token')
    assert.match(url, /\/api\/my-songs\/9$/)
    assert.equal(request.method, 'DELETE')
    assert.equal(new Headers(request.headers).get('Authorization'), 'Bearer signed-token')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('odrzuca nieprawidłową odpowiedź listy', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ data: 'bad' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

  try {
    await assert.rejects(fetchMySongs('signed-token'), /nieprawidłową listę/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
