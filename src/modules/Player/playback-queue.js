import { getSongId } from '../Catalog/song.js'

const playable = (songs) => Array.isArray(songs)
  ? songs.filter((song) => getSongId(song) !== null)
  : []

export function buildPlaybackQueue(playbackQueue, songs) {
  const queue = playable(playbackQueue)
  return { queue, suggestions: queue.length ? [] : playable(songs).slice(0, 7) }
}

export function formatQueueCount(count) {
  const lastTwo = count % 100
  const noun = count === 1 ? 'utwór'
    : count % 10 >= 2 && count % 10 <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'utwory' : 'utworów'
  return `${count} ${noun} w kolejce`
}
