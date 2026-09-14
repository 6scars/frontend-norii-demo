import assert from 'node:assert/strict'
import test from 'node:test'

import { getAdjacentTrack } from '../src/modules/Player/player-navigation.ts'

const playlist = [{ song_id: 11 }, { song_id: 22 }, { id: 33 }]

test('następny utwór przesuwa indeks i zawija koniec playlisty', () => {
  assert.deepEqual(getAdjacentTrack(playlist, 0, 'next'), { index: 1, songId: 22 })
  assert.deepEqual(getAdjacentTrack(playlist, 2, 'next'), { index: 0, songId: 11 })
})

test('poprzedni utwór przesuwa indeks i zawija początek playlisty', () => {
  assert.deepEqual(getAdjacentTrack(playlist, 2, 'previous'), { index: 1, songId: 22 })
  assert.deepEqual(getAdjacentTrack(playlist, 0, 'previous'), { index: 2, songId: 33 })
})

test('nawigacja zachowuje dotychczasowe zachowanie pustego indeksu', () => {
  assert.deepEqual(getAdjacentTrack(playlist, null, 'next'), { index: 1, songId: 22 })
  assert.deepEqual(getAdjacentTrack(playlist, null, 'previous'), { index: 2, songId: 33 })
})

test('nawigacja zwraca null dla pustej playlisty i odrzuca niegrywalny rekord', () => {
  assert.equal(getAdjacentTrack([], 0, 'next'), null)
  assert.equal(getAdjacentTrack(null, 0, 'previous'), null)
  assert.throws(() => getAdjacentTrack([{}], 0, 'next'), /identyfikatora/)
})
