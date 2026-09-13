import test from 'node:test'
import assert from 'node:assert/strict'

import { buildDiscoveryModel } from '../src/modules/Discovery/discovery-model.js'

const songs = [
  { id: 1, song_name: 'Światła miasta', author: 'Zorza', album_name: 'Noc' },
  { id: 2, song_name: 'Cisza', author: 'Kair', album_name: 'Cienie' },
  { song_id: 3, song_name: 'Powrót', author: 'zorza', album_name: 'Droga' },
]

test('wyszukiwanie odkrywania uwzględnia tytuł, autora i album bez zmiany wejścia', () => {
  const input = [...songs]

  assert.deepEqual(buildDiscoveryModel(input, 'Kair').tracks.map((song) => song.id), [2])
  assert.deepEqual(buildDiscoveryModel(input, 'noc').tracks.map((song) => song.id), [1])
  assert.deepEqual(input, songs)
})

test('model odkrywania zwraca unikalnych wykonawców z pierwszym powiązanym utworem', () => {
  const model = buildDiscoveryModel(songs, '')

  assert.deepEqual(model.artists.map((artist) => artist.name), ['Zorza', 'Kair'])
  assert.equal(model.artists[0].song.song_name, 'Światła miasta')
})

test('model odkrywania odrzuca niepełne rekordy i bezpiecznie obsługuje brak danych', () => {
  assert.deepEqual(buildDiscoveryModel(null, ''), { featured: null, tracks: [], artists: [] })
  assert.deepEqual(buildDiscoveryModel([{ id: 4 }, null], '').tracks, [])
})
