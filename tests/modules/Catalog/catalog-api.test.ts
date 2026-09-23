import assert from 'node:assert/strict'
import test from 'node:test'

import { fetchSong, fetchSongs, recordSongView } from '../../../src/modules/Catalog/catalog-api.ts'
import { parseRequestBody, requestUrl } from '../../test-helpers/http/fetch.ts'

await test('API katalogu normalizuje listę i pojedynczy utwór', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  const calls: string[] = []

  globalThis.fetch = (url) => {
    calls.push(requestUrl(url))
    return Promise.resolve(new Response(JSON.stringify({ data: [{ song_id: 4, song_name: 'Noc' }] }), { status: 200 }))
  }

  assert.deepEqual(await fetchSongs(), [{ song_id: 4, song_name: 'Noc' }])
  assert.deepEqual(await fetchSong('mix/4'), { song_id: 4, song_name: 'Noc' })
  assert.match(calls[0]!, /\/api\/fetchSongs$/)
  assert.match(calls[1]!, /\/api\/getSong\?id=mix%2F4$/)
})

await test('zapis odsłuchania zachowuje kontrakt endpointu i token sesji', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = (url, options) => {
    assert.match(requestUrl(url), /\/api\/addView$/)
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer listener-token')
    assert.deepEqual(parseRequestBody(options), { song_id: 4 })
    return Promise.resolve(new Response(JSON.stringify({ message: 'Zapisano' }), { status: 200 }))
  }

  assert.deepEqual(await recordSongView(4, 'listener-token'), { message: 'Zapisano' })
})
