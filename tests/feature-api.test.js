import assert from 'node:assert/strict'
import test from 'node:test'

import { authenticate, validateSession } from '../src/modules/Auth/auth-api.js'
import { updateUsername } from '../src/modules/Account/account-api.js'
import { fetchSong, fetchSongs, recordSongView } from '../src/modules/Catalog/catalog-api.js'
import { createPlaylist, fetchPlaylistDetails, fetchUserPlaylists } from '../src/modules/Playlists/playlists-api.js'
import { fetchAuthorAlbums } from '../src/modules/Upload/upload-api.js'

test('walidacja bez tokenu kończy się bez żądania sieciowego', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async () => { throw new Error('fetch should not be called') }

  assert.equal(await validateSession(null), false)
})

test('uwierzytelnianie wybiera endpoint na podstawie trybu formularza', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/api\/newAccount$/)
    assert.deepEqual(JSON.parse(options.body), { email: 'user@example.com', password: 'secret' })
    return new Response(JSON.stringify({ message: 'Konto utworzone' }), { status: 200 })
  }

  const payload = await authenticate('signup', { email: 'user@example.com', password: 'secret' })

  assert.equal(payload.message, 'Konto utworzone')
})

test('pobieranie playlist bez użytkownika zwraca pustą kolekcję', async () => {
  assert.deepEqual(await fetchUserPlaylists(null), [])
})

test('tworzenie playlisty zachowuje obecny kontrakt backendu', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/api\/createPlaylist$/)
    assert.equal(options.headers.get('Authorization'), 'Bearer token-123')
    assert.deepEqual(JSON.parse(options.body), {
      playlistName: 'Wieczór',
      songsToAddArray: [1, 2],
    })
    return new Response(JSON.stringify({ message: 'Utworzono' }), { status: 200 })
  }

  const payload = await createPlaylist({ name: 'Wieczór', trackIds: [1, 2] }, 'token-123')

  assert.equal(payload.message, 'Utworzono')
})

test('szczegóły playlisty kodują identyfikator i normalizują dane', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url) => {
    assert.match(url, /\/api\/getPlaylistData\?id=road%2Ftrip$/)
    return new Response(JSON.stringify({ data: [{ song_id: 1 }] }), { status: 200 })
  }

  assert.deepEqual(await fetchPlaylistDetails('road/trip'), [{ song_id: 1 }])
})

test('pobieranie albumów autora przekazuje token przez wspólną warstwę HTTP', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/api\/getAuthorsAlbums$/)
    assert.equal(options.headers.get('Authorization'), 'Bearer creator-token')
    return new Response(JSON.stringify({ data: [{ id: 7, album_name: 'Debiut' }] }), { status: 200 })
  }

  assert.deepEqual(await fetchAuthorAlbums('creator-token'), [{ id: 7, album_name: 'Debiut' }])
})

test('API katalogu normalizuje listę i pojedynczy utwór', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  const calls = []

  globalThis.fetch = async (url) => {
    calls.push(url)
    return new Response(JSON.stringify({ data: [{ song_id: 4, song_name: 'Noc' }] }), { status: 200 })
  }

  assert.deepEqual(await fetchSongs(), [{ song_id: 4, song_name: 'Noc' }])
  assert.deepEqual(await fetchSong('mix/4'), { song_id: 4, song_name: 'Noc' })
  assert.match(calls[0], /\/api\/fetchSongs$/)
  assert.match(calls[1], /\/api\/getSong\?id=mix%2F4$/)
})

test('zapis odsłuchania zachowuje kontrakt endpointu i token sesji', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/api\/addView$/)
    assert.equal(options.headers.get('Authorization'), 'Bearer listener-token')
    assert.deepEqual(JSON.parse(options.body), { song_id: 4 })
    return new Response(JSON.stringify({ message: 'Zapisano' }), { status: 200 })
  }

  assert.deepEqual(await recordSongView(4, 'listener-token'), { message: 'Zapisano' })
})

test('aktualizacja nazwy użytkownika zachowuje kontrakt backendu', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })

  globalThis.fetch = async (url, options) => {
    assert.match(url, /\/api\/updateUsername$/)
    assert.equal(options.method, 'POST')
    assert.equal(options.headers.get('Authorization'), 'Bearer profile-token')
    assert.deepEqual(JSON.parse(options.body), { username: 'Nowa nazwa' })
    return new Response(JSON.stringify({ message: 'Zapisano' }), { status: 200 })
  }

  const payload = await updateUsername('  Nowa nazwa  ', 'profile-token')

  assert.deepEqual(payload, { message: 'Zapisano' })
})

test('aktualizacja nazwy użytkownika odrzuca pustą wartość bez żądania', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async () => { throw new Error('fetch should not be called') }

  await assert.rejects(updateUsername('   ', 'profile-token'), /Nazwa użytkownika jest wymagana/)
})

test('aktualizacja nazwy użytkownika odrzuca wartość dłuższą niż limit', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async () => { throw new Error('fetch should not be called') }

  await assert.rejects(updateUsername('a'.repeat(51), 'profile-token'), /maksymalnie 50 znaków/)
})
