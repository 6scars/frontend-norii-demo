import { getSongId } from '../Catalog/song.js'

const storageKey = 'latest'
export const RECENTLY_PLAYED_LIMIT = 5

function getBrowserStorage() {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function addRecentlyPlayed(songs, newSong, limit = RECENTLY_PLAYED_LIMIT) {
  const previousSongs = Array.isArray(songs) ? songs : []
  const seenIds = new Set([getSongId(newSong)])
  const uniqueSongs = previousSongs.filter((song) => {
    const songId = getSongId(song)
    if (songId === null || seenIds.has(songId)) return false
    seenIds.add(songId)
    return true
  })
  return [newSong, ...uniqueSongs].slice(0, limit)
}

export function readRecentlyPlayed(storage = getBrowserStorage()) {
  if (!storage) return []

  try {
    const songs = JSON.parse(storage.getItem(storageKey) || '[]')
    return Array.isArray(songs) ? songs : []
  } catch {
    return []
  }
}

export function saveRecentlyPlayed(songs, storage = getBrowserStorage()) {
  storage?.setItem(storageKey, JSON.stringify(songs))
}
