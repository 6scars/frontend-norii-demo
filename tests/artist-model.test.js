import test from 'node:test'
import assert from 'node:assert/strict'

import { buildArtistModel } from '../src/modules/Artists/artist-model.js'

const songs = [
  { id: 1, song_name: 'Cienie', author: 'Kair', biograph: 'Nocne brzmienia.', follows: 120 },
  { id: 2, song_name: 'Powrót', author: 'Kair', biograph: 'Nocne brzmienia.', follows: 120 },
  { id: 3, song_name: 'Mgła', author: 'Lena' },
]

test('profil twórcy wybiera wyłącznie utwory wskazanego autora', () => {
  const model = buildArtistModel(songs, 'kair')

  assert.equal(model.name, 'Kair')
  assert.equal(model.biography, 'Nocne brzmienia.')
  assert.equal(model.followers, 120)
  assert.deepEqual(model.tracks.map((song) => song.id), [1, 2])
})

test('profil twórcy zwraca jawny pusty model dla nieznanej nazwy', () => {
  assert.deepEqual(buildArtistModel(songs, 'Nie istnieje'), {
    biography: '',
    followers: null,
    name: 'Nie istnieje',
    portrait: null,
    tracks: [],
  })
})
