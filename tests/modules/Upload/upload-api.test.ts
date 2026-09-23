import assert from 'node:assert/strict'
import { test } from 'node:test'

import { fetchAuthorAlbums, uploadSong } from '../../../src/modules/Upload/upload-api.ts'
import { requestUrl } from '../../test-helpers/http/fetch.ts'

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

await test('pobieranie albumów autora przekazuje token przez wspólną warstwę HTTP', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url, options) => {
    assert.match(requestUrl(url), /\/api\/getAuthorsAlbums$/)
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer creator-token')
    return Promise.resolve(new Response(JSON.stringify({ data: [{ id: 7, album_name: 'Debiut' }] }), { status: 200 }))
  }

  assert.deepEqual(await fetchAuthorAlbums('creator-token'), [{ id: 7, album_name: 'Debiut' }])
})
