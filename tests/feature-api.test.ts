import { requestUrl, parseRequestBody } from './fetch-test-helpers.ts'
import assert from 'node:assert/strict'
import test from 'node:test'

import { authenticate, validateSession } from '../src/modules/Auth/auth-api.ts'
import { updateUsername } from '../src/modules/Account/account-api.ts'
import { fetchSong, fetchSongs, recordSongView } from '../src/modules/Catalog/catalog-api.ts'
import { createPlaylist, fetchPlaylistDetails, fetchUserPlaylists } from '../src/modules/Playlists/playlists-api.ts'
import { fetchAuthorAlbums } from '../src/modules/Upload/upload-api.ts'

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
