import assert from 'node:assert/strict'
import test from 'node:test'

import {
  addRecentlyPlayed,
  readRecentlyPlayed,
  saveRecentlyPlayed,
} from '../../../src/modules/RecentlyPlayed/recently-played.ts'

function createStorage(initialValues: Record<string, string> = {}) {
  const values = new Map<string, string>(Object.entries(initialValues))

  return {
    getItem(key: string) {
      return values.get(key) ?? null
    },
    setItem(key: string, value: string) {
      values.set(key, String(value))
    },
  }
}

await test('ostatnio słuchane przenoszą ponownie wybrany utwór na początek bez duplikatu', () => {
  const songs = [{ id: 1 }, { id: 2 }, { id: 3 }]

  assert.deepEqual(addRecentlyPlayed(songs, songs[1]!, 3), [{ id: 2 }, { id: 1 }, { id: 3 }])
  assert.deepEqual(songs, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

await test('ostatnio słuchane rozpoznają song_id i zachowują pozostałe unikalne utwory', () => {
  const songs = [{ song_id: 1 }, { song_id: 2 }, { song_id: 1 }, { song_id: 3 }]

  assert.deepEqual(addRecentlyPlayed(songs, { song_id: 2 }), [
    { song_id: 2 },
    { song_id: 1 },
    { song_id: 3 },
  ])
})

await test('ostatnio słuchane domyślnie zachowują maksymalnie pięć utworów', () => {
  const songs = Array.from({ length: 5 }, (_, index) => ({ id: index + 1 }))

  assert.deepEqual(addRecentlyPlayed(songs, { id: 6 }).map((song) => song.id), [6, 1, 2, 3, 4])
})

await test('ostatnio słuchane zachowują zadany limit', () => {
  assert.deepEqual(addRecentlyPlayed([{ id: 1 }, { id: 2 }], { id: 3 }, 2), [{ id: 3 }, { id: 1 }])
})

await test('pamięć ostatnich odsłuchów bezpiecznie obsługuje uszkodzony JSON', () => {
  assert.deepEqual(readRecentlyPlayed(createStorage({ latest: '{broken' })), [])
  assert.deepEqual(readRecentlyPlayed(createStorage({ latest: '{"id":1}' })), [])
})

await test('pamięć ostatnich odsłuchów zapisuje i odczytuje listę', () => {
  const storage = createStorage()
  const songs = [{ id: 7 }]

  saveRecentlyPlayed(songs, storage)

  assert.deepEqual(readRecentlyPlayed(storage), songs)
})
