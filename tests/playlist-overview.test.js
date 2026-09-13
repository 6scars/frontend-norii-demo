import test from 'node:test'
import assert from 'node:assert/strict'

import { buildPlaylistOverview } from '../src/modules/Playlists/playlist-overview.js'

const playlists = [
  { playlist_id: 4, playlist_name: 'Nocne miasto', song_ids: [1, 2] },
  { playlist_id: 7, playlist_name: 'Spokojny ranek', song_ids: [3] },
]

test('przegląd playlist wybiera pierwszą realną listę jako wyróżnioną', () => {
  const model = buildPlaylistOverview(playlists, '')

  assert.equal(model.featured.playlist_id, 4)
  assert.deepEqual(model.items.map((playlist) => playlist.playlist_id), [4, 7])
})

test('przegląd playlist filtruje nazwy bez rozróżniania wielkości liter', () => {
  const model = buildPlaylistOverview(playlists, 'SPOKOJNY')

  assert.deepEqual(model.items.map((playlist) => playlist.playlist_id), [7])
})

test('przegląd playlist bez poprawnych danych ma jawny pusty model', () => {
  assert.deepEqual(buildPlaylistOverview([{ playlist_id: null }, null], ''), { featured: null, items: [], total: 0 })
})
