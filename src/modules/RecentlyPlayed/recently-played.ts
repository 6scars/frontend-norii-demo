import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

interface RecentlyPlayedStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const storageKey = 'latest'
export const RECENTLY_PLAYED_LIMIT = 5

function getBrowserStorage(): RecentlyPlayedStorage | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function addRecentlyPlayed(
  songs: readonly Song[] | null | undefined,
  newSong: Song,
  limit = RECENTLY_PLAYED_LIMIT,
): Song[] {
  const previousSongs = songs ?? []
  const seenIds = new Set([getSongId(newSong)])
  const uniqueSongs = previousSongs.filter((song) => {
    const songId = getSongId(song)
    if (songId === null || seenIds.has(songId)) return false
    seenIds.add(songId)
    return true
  })
  return [newSong, ...uniqueSongs].slice(0, limit)
}

export function readRecentlyPlayed(
  storage: RecentlyPlayedStorage | null = getBrowserStorage(),
): Song[] {
  if (!storage) return []

  try {
    const songs = JSON.parse(storage.getItem(storageKey) || '[]') as unknown
    return Array.isArray(songs) ? songs as Song[] : []
  } catch {
    return []
  }
}

export function saveRecentlyPlayed(
  songs: readonly Song[],
  storage: RecentlyPlayedStorage | null = getBrowserStorage(),
): void {
  storage?.setItem(storageKey, JSON.stringify(songs))
}

