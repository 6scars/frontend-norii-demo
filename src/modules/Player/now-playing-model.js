import { getSongId } from '../Catalog/song.js'

const playableSongs = (items) => Array.isArray(items)
  ? items.filter((song) => getSongId(song) !== null)
  : []

export function buildNowPlayingModel({ currentSong, playbackQueue, songs }) {
  const queueSongs = playableSongs(playbackQueue)
  const catalog = playableSongs(songs)
  const currentSongId = getSongId(currentSong)
  let queue = queueSongs.length ? queueSongs : catalog

  if (currentSongId !== null && !queue.some((song) => String(getSongId(song)) === String(currentSongId))) {
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
