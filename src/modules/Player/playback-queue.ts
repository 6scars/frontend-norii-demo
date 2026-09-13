import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

const playable = (
  songs: readonly (Song | null | undefined)[] | null | undefined,
): Song[] =>
  songs ? songs.filter((song): song is Song => Boolean(song) && getSongId(song) !== null)
    : []

export interface PlaybackQueueModel {
  queue: Song[]
  suggestions: Song[]
}

export function buildPlaybackQueue(
  playbackQueue: readonly (Song | null | undefined)[] | null | undefined,
  songs: readonly (Song | null | undefined)[] | null | undefined,
): PlaybackQueueModel {
  const queue = playable(playbackQueue)
  return {
    queue,
    suggestions: queue.length ? [] : playable(songs).slice(0, 7),
  }
}

export function formatQueueCount(count: number): string {
  const lastTwo = count % 100
  const noun = count === 1
    ? 'utwór'
    : count % 10 >= 2
      && count % 10 <= 4
      && (lastTwo < 12 || lastTwo > 14)
      ? 'utwory'
      : 'utworów'
  return `${count} ${noun} w kolejce`
}

