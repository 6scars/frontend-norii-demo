import test from 'node:test'
import assert from 'node:assert/strict'

import { buildRadioModel } from '../src/modules/Radio/radio-model.js'

const songs = [
  { id: 1, song_name: 'Cienie', author: 'Kair', views: 90 },
  { id: 2, song_name: 'Mgła', author: 'Lena', views: 10 },
  { id: 3, song_name: 'Światła', author: 'Zorza', views: 50 },
]

test('radio buduje trzy stacje z realnego katalogu bez zmiany wejścia', () => {
  const snapshot = structuredClone(songs)
  const model = buildRadioModel(songs)

  assert.equal(model.stations.length, 3)
  assert.deepEqual(model.stations[0].tracks.map((song) => song.id), [1, 2, 3])
  assert.deepEqual(model.stations[1].tracks.map((song) => song.id), [1, 3, 2])
  assert.deepEqual(model.stations[2].tracks.map((song) => song.id), [2, 3, 1])
  assert.deepEqual(songs, snapshot)
})

test('radio odrzuca niegrywalne rekordy i bezpiecznie obsługuje pusty katalog', () => {
  const model = buildRadioModel([{ id: null, song_name: 'Brak ID' }, null])

  assert.equal(model.total, 0)
  assert.deepEqual(model.stations, [])
})
