import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

interface ArtistResult {
  name: string
  song: Song
}

export interface DiscoveryModel {
  featured: Song | null
  tracks: Song[]
  artists: ArtistResult[]
}

const normalize = (value: string | null | undefined): string =>
  String(value ?? '').trim().toLocaleLowerCase('pl')

function isDiscoverableSong(song: Song | null | undefined): song is Song {
  return Boolean(
    song
    && getSongId(song) !== null
    && song.song_name
    && song.author,
  )
}

export function buildDiscoveryModel(
  songsValue: readonly (Song | null | undefined)[] | null | undefined,
  queryValue: string | null | undefined,
): DiscoveryModel {
  const catalog = songsValue ? songsValue.filter(isDiscoverableSong)
    : []
  const query = normalize(queryValue)
  const tracks = query
    ? catalog.filter((song) =>
        normalize(`${song.song_name} ${song.author} ${song.album_name ?? ''}`).includes(query),
      )
    : [...catalog]
  const artistsByName = new Map<string, ArtistResult>()

  for (const song of tracks) {
    const key = normalize(song.author)
    if (!artistsByName.has(key)) {
      artistsByName.set(key, { name: song.author as string, song })
    }
  }

  return {
    featured: catalog[0] ?? null,
    tracks,
    artists: [...artistsByName.values()],
  }
}

