import { getSongId } from '../Catalog/song.ts'
import { RECENTLY_PLAYED_LIMIT } from '../RecentlyPlayed/recently-played.ts'
import type { Song } from '../../shared/types/domain.ts'

interface HomeMix {
  title: string
  subtitle: string
  tracks: Song[]
}

export interface HomeModel {
  featured: Song | null
  selected: Song[]
  recent: Song[]
  mixes: HomeMix[]
}

function compactSongs(
  value: readonly (Song | null | undefined)[] | null | undefined,
): Song[] {
  return value ? value.filter((song): song is Song => Boolean(song))
    : []
}

export function buildHomeModel(
  songsValue: readonly (Song | null | undefined)[] | null | undefined,
  latestValue: readonly (Song | null | undefined)[] | null | undefined,
): HomeModel {
  const songs = compactSongs(songsValue)
  const latest = compactSongs(latestValue)
  const recentIds = new Set<string | number>()
  const recent = latest
    .filter((song) => {
      const id = getSongId(song)
      if (id === null || recentIds.has(id)) return false
      recentIds.add(id)
      return true
    })
    .slice(0, RECENTLY_PLAYED_LIMIT)

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
  ] as const

  const mixes = mixDetails
    .map(([title, subtitle], mixIndex): HomeMix => ({
      title,
      subtitle,
      tracks: songs.filter(
        (_, songIndex) => songIndex % mixDetails.length === mixIndex,
      ),
    }))
    .filter((mix) => mix.tracks.length > 0)

  return {
    featured: songs[0] ?? null,
    selected: songs.slice(0, 5),
    recent,
    mixes,
  }
}

