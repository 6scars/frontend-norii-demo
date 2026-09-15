import assert from 'node:assert/strict'
import { test } from 'node:test'

import { uploadSong } from '../src/modules/Upload/upload-api.ts'

await test('song upload sends JWT in the Authorization header', async () => {
  const originalFetch = globalThis.fetch
  let request: RequestInit = {}

  globalThis.fetch = (_url, options) => {
    request = options ?? {}
    return Promise.resolve(new Response(JSON.stringify({ message: 'ok' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }))
  }

  try {
    const formData = new FormData()
    formData.append('addSongForm', '{}')
    await uploadSong(formData, 'signed-token')

    assert.equal(new Headers(request.headers).get('Authorization'), 'Bearer signed-token')
    assert.equal(request.body, formData)
  } finally {
    globalThis.fetch = originalFetch
  }
})
