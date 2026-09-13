import test from 'node:test'
import assert from 'node:assert/strict'

import { buildPlaylistPageModel } from '../src/modules/Playlists/playlist-page-model.js'

test('model szczegółów oddziela nazwę playlisty od grywalnych utworów', () => {
  const model = buildPlaylistPageModel([
    { name: 'Nocne światła', song_id: 7, song_name: 'Cienie', author: 'Kair' },
    { name: 'Nocne światła', song_id: 8, song_name: 'Mgła', author: 'Lena' },
  ])

  assert.equal(model.name, 'Nocne światła')
  assert.equal(model.total, 2)
  assert.deepEqual(model.tracks.map((track) => track.song_id), [7, 8])
})

test('model rozpoznaje pustą playlistę zwracaną jako wiersz techniczny', () => {
  const model = buildPlaylistPageModel([{ name: 'Cisza', song_id: null, song_name: null }])

  assert.equal(model.name, 'Cisza')
  assert.equal(model.total, 0)
  assert.deepEqual(model.tracks, [])
})
