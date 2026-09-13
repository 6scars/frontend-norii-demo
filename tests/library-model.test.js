import test from 'node:test'
import assert from 'node:assert/strict'

import { buildLibraryModel } from '../src/modules/Library/library-model.js'
import { getPlaylistSongCount, playlistContainsSong } from '../src/modules/Playlists/playlist-collection.js'

const playlists = [
  { playlist_id: 2, playlist_name: 'Żar', song_ids: [4, 5], song_images: ['zar.jpg'] },
  { playlist_id: 1, playlist_name: 'Cisza', song_ids: ['NULL'], song_images: [] },
  { playlist_id: 3, playlist_name: 'Światło', song_ids: [8], song_images: ['swiatlo.jpg'] },
]

test('biblioteka filtruje playlisty po nazwie i nie zmienia danych wejściowych', () => {
  const input = [...playlists]
  const model = buildLibraryModel(input, { query: 'świat', sort: 'recent' })

  assert.deepEqual(model.items.map((item) => item.playlist_id), [3])
  assert.deepEqual(input, playlists)
})

test('biblioteka sortuje nazwy zgodnie z polską lokalizacją', () => {
  const model = buildLibraryModel(playlists, { query: '', sort: 'name' })

  assert.deepEqual(model.items.map((item) => item.playlist_name), ['Cisza', 'Światło', 'Żar'])
})

test('licznik playlisty rozpoznaje sentinel pustej listy', () => {
  assert.equal(getPlaylistSongCount(playlists[0]), 2)
  assert.equal(getPlaylistSongCount(playlists[1]), 0)
  assert.equal(getPlaylistSongCount(null), 0)
})

test('członkostwo utworu w playliście nie zależy od typu identyfikatora', () => {
  assert.equal(playlistContainsSong({ song_ids: [4, '5'] }, { id: 5 }), true)
  assert.equal(playlistContainsSong({ song_ids: ['NULL'] }, { song_id: 5 }), false)
  assert.equal(playlistContainsSong(null, { id: 5 }), false)
})

test('biblioteka bez danych zwraca bezpieczny pusty model', () => {
  assert.deepEqual(buildLibraryModel(null, {}), { items: [], total: 0 })
})
