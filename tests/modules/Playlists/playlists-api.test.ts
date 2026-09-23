import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createPlaylist,
  fetchPlaylistDetails,
  fetchUserPlaylists,
} from '../../../src/modules/Playlists/playlists-api.ts'
import { parseRequestBody, requestUrl } from '../../test-helpers/http/fetch.ts'

await test('pobieranie playlist bez użytkownika zwraca pustą kolekcję', async () => {
  assert.deepEqual(await fetchUserPlaylists(null), [])
})

await test('tworzenie playlisty zachowuje obecny kontrakt backendu', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url, options) => {
    assert.match(requestUrl(url), /\/api\/createPlaylist$/)
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer token-123')
    assert.deepEqual(parseRequestBody(options), {
      playlistName: 'Wieczór',
      songsToAddArray: [1, 2],
    })
    return Promise.resolve(new Response(JSON.stringify({ message: 'Utworzono' }), { status: 200 }))
  }

  const payload = await createPlaylist({ name: 'Wieczór', trackIds: [1, 2] }, 'token-123')

  assert.equal(payload.message, 'Utworzono')
})

await test('szczegóły playlisty kodują identyfikator i normalizują dane', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url) => {
    assert.match(requestUrl(url), /\/api\/getPlaylistData\?id=road%2Ftrip$/)
    return Promise.resolve(new Response(JSON.stringify({ data: [{ song_id: 1 }] }), { status: 200 }))
  }

  assert.deepEqual(await fetchPlaylistDetails('road/trip'), [{ song_id: 1 }])
})
