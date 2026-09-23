import test from 'node:test'
import assert from 'node:assert/strict'
import { buildPlaybackQueue, formatQueueCount } from '../../../src/modules/Player/playback-queue.ts'

await test('wyczyszczona kolejka pozostaje pusta, katalog trafia wyłącznie do propozycji', () => {
  const songs = [{ id: 1 }, { song_id: 2 }]
  assert.deepEqual(buildPlaybackQueue([], songs), { queue: [], suggestions: songs })
})

await test('kolejka zachowuje kolejność i duplikaty, pomijając niegrywalne rekordy', () => {
  const tracks = [{ id: 2 }, null, { song_id: 1 }, { id: 2 }]
  assert.deepEqual(buildPlaybackQueue(tracks, [{ id: 3 }]), {
    queue: [tracks[0], tracks[2], tracks[3]], suggestions: [],
  })
  assert.equal(tracks.length, 4)
  assert.deepEqual(buildPlaybackQueue(null, undefined), { queue: [], suggestions: [] })
})

await test('licznik kolejki używa polskiej odmiany', () => {
  for (const [count, noun] of [[0, 'utworów'], [1, 'utwór'], [2, 'utwory'], [12, 'utworów'], [22, 'utwory'], [112, 'utworów']] as const) {
    assert.equal(formatQueueCount(count), `${count} ${noun} w kolejce`)
  }
})
