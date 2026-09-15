import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

export interface ArtistModel {
  biography: string
  followers: number | string | null
  name: string
  portrait: string | null
  tracks: Song[]
}

const normalizeArtistName = (value: string | null | undefined): string =>
  String(value || '').trim().toLocaleLowerCase('pl')

export function buildArtistModel(
  songs: readonly (Song | null | undefined)[] | null | undefined,
  artistName: string | null | undefined,
): ArtistModel {
  const requestedName = String(artistName || '').trim()
  const normalizedName = normalizeArtistName(requestedName)
  const tracks = songs ? songs.filter(
        (song): song is Song =>
          song != null
          && getSongId(song) !== null
          && normalizeArtistName(song.author) === normalizedName,
      )
    : []
  const profile = tracks[0]

  return {
    biography: profile?.biograph || '',
    followers: profile?.follows ?? null,
    name: profile?.author || requestedName,
    portrait: profile?.author_image || null,
    tracks,
  }
}


