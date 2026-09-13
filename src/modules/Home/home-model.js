import { getSongId } from '../Catalog/song.js'
import { RECENTLY_PLAYED_LIMIT } from '../RecentlyPlayed/recently-played.js'

export function buildHomeModel(songsValue, latestValue) {
  const songs = Array.isArray(songsValue) ? songsValue.filter(Boolean) : []
  const latest = Array.isArray(latestValue) ? latestValue.filter(Boolean) : []
  const recentIds = new Set()
  const recent = latest.filter((song) => {
    const id = getSongId(song)
    if (id === null || recentIds.has(id)) return false
    recentIds.add(id)
    return true
  }).slice(0, RECENTLY_PLAYED_LIMIT)

  if (!songs.length) {
    return {
      featured: null,
      selected: [],
      recent,
      mixes: [],
    }
  }

  const mixDetails = [
    ['Daily Mix 1', 'Ostatnio słuchane'],
    ['Daily Mix 2', 'Nowe rekomendacje'],
    ['Daily Mix 3', 'Głębokie brzmienia'],
    ['Daily Mix 4', 'Spokojniejszy wybór'],
  ]

  const mixes = mixDetails.map(([title, subtitle], mixIndex) => ({
    title,
    subtitle,
    tracks: songs.filter((_, songIndex) => songIndex % mixDetails.length === mixIndex),
  })).filter((mix) => mix.tracks.length)

  return {
    featured: songs[0],
    selected: songs.slice(0, 5),
    recent,
    mixes,
  }
}
