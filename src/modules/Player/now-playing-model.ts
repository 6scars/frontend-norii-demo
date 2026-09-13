import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

const playableSongs = (
  items: readonly (Song | null | undefined)[] | null | undefined,
): Song[] =>
  items ? items.filter((song): song is Song => Boolean(song) && getSongId(song) !== null)
    : []

interface NowPlayingInput {
  currentSong: Song | null
  playbackQueue: readonly Song[]
  songs: readonly Song[]
}

export interface NowPlayingModel {
  activeIndex: number
  activeSong: Song | null
  queue: Song[]
}

export function buildNowPlayingModel({
  currentSong,
  playbackQueue,
  songs,
}: NowPlayingInput): NowPlayingModel {
  const queueSongs = playableSongs(playbackQueue)
  const catalog = playableSongs(songs)
  const currentSongId = getSongId(currentSong)
  let queue = queueSongs.length ? queueSongs : catalog

  if (
    currentSongId !== null
    && !queue.some((song) => String(getSongId(song)) === String(currentSongId))
    && currentSong
  ) {
    queue = [currentSong, ...queue]
  }

  const activeIndex = currentSongId === null
    ? -1
    : queue.findIndex((song) => String(getSongId(song)) === String(currentSongId))

  return {
    activeIndex,
    activeSong: currentSongId === null ? null : currentSong,
    queue,
  }
}

