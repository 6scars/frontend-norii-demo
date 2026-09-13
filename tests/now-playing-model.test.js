import test from 'node:test'
import assert from 'node:assert/strict'

import { buildNowPlayingModel } from '../src/modules/Player/now-playing-model.js'

const songs = [
  { id: 1, song_name: 'Cienie', author: 'Kair' },
  { id: 2, song_name: 'Powrót', author: 'Kair' },
  { id: 3, song_name: 'Mgła', author: 'Lena' },
]

test('widok teraz gra zachowuje kolejność aktywnej playlisty i wskazuje bieżący utwór', () => {
  const model = buildNowPlayingModel({
    playbackQueue: [songs[2], songs[0]],
    currentSong: songs[0],
    songs,
  })

  assert.equal(model.activeIndex, 1)
  assert.equal(model.activeSong.id, 1)
  assert.deepEqual(model.queue.map((song) => song.id), [3, 1])
})

test('widok teraz gra dodaje bieżący utwór, gdy nie ma go jeszcze w kolejce', () => {
  const model = buildNowPlayingModel({ playbackQueue: [songs[1]], currentSong: songs[0], songs })

  assert.equal(model.activeIndex, 0)
  assert.deepEqual(model.queue.map((song) => song.id), [1, 2])
})

test('widok teraz gra nie wybiera ani nie uruchamia utworu samodzielnie', () => {
  const model = buildNowPlayingModel({ playbackQueue: [], currentSong: null, songs })

  assert.equal(model.activeSong, null)
  assert.equal(model.activeIndex, -1)
  assert.deepEqual(model.queue.map((song) => song.id), [1, 2, 3])
})
