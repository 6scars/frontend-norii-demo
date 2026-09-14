import test from 'node:test'
import assert from 'node:assert/strict'

import { getSongId } from '../src/modules/Catalog/song.ts'
import { buildHomeModel } from '../src/modules/Home/home-model.ts'

const songs = Array.from({ length: 9 }, (_, index) => ({
  song_id: index + 1,
  song_name: `Utwór ${index + 1}`,
  author: `Twórca ${index + 1}`,
}))

test('buildHomeModel wybiera realny utwór i zachowuje wejściową tablicę', () => {
  const original = [...songs]
  const model = buildHomeModel(songs, [])

  assert.equal(model.featured.song_id, 1)
  assert.deepEqual(songs, original)
  assert.equal(model.selected.length, 5)
})

test('buildHomeModel wykorzystuje ostatnio słuchane bez duplikatów', () => {
  const latest = [songs[2], songs[0], songs[2]]
  const model = buildHomeModel(songs, latest)

  assert.deepEqual(model.recent.map(getSongId), [3, 1])
  assert.equal(model.mixes.length, 4)
  assert.ok(model.mixes.every((mix) => mix.tracks.length > 0))
})

test('buildHomeModel pokazuje najwyżej pięć ostatnio słuchanych utworów', () => {
  const model = buildHomeModel(songs, songs.slice(0, 7))

  assert.deepEqual(model.recent.map(getSongId), [1, 2, 3, 4, 5])
})

test('getSongId obsługuje oba identyfikatory używane w aktualnym projekcie', () => {
  assert.equal(getSongId({ song_id: 7 }), 7)
  assert.equal(getSongId({ id: 8 }), 8)
  assert.equal(getSongId(null), null)
})

test('buildHomeModel zwraca bezpieczny pusty model bez danych', () => {
  assert.deepEqual(buildHomeModel(null, null), {
    featured: null,
    selected: [],
    recent: [],
    mixes: [],
  })
})
