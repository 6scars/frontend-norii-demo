import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getPlaylistSongCount,
  playlistContainsSong,
} from '../../../src/modules/Playlists/playlist-collection.ts'

const playlists = [
  { playlist_id: 2, playlist_name: 'Żar', song_ids: [4, 5], song_images: ['zar.jpg'] },
  { playlist_id: 1, playlist_name: 'Cisza', song_ids: ['NULL'], song_images: [] },
]

await test('licznik playlisty rozpoznaje sentinel pustej listy', () => {
  assert.equal(getPlaylistSongCount(playlists[0]), 2)
  assert.equal(getPlaylistSongCount(playlists[1]), 0)
  assert.equal(getPlaylistSongCount(null), 0)
})

await test('członkostwo utworu w playliście nie zależy od typu identyfikatora', () => {
  assert.equal(playlistContainsSong({ song_ids: [4, '5'] }, { id: 5 }), true)
  assert.equal(playlistContainsSong({ song_ids: ['NULL'] }, { song_id: 5 }), false)
  assert.equal(playlistContainsSong(null, { id: 5 }), false)
})
