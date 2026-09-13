import { SUPABASE_STORAGE_URL } from '../../config.ts'
import type { EntityId, Song } from '../../shared/types/domain.ts'

export function getSongId(song: Song | null | undefined): EntityId | null {
  return song?.song_id ?? song?.id ?? null
}

const artworkStorageUrl = `${SUPABASE_STORAGE_URL}/images/songPictures`
const artistArtworkStorageUrl = `${SUPABASE_STORAGE_URL}/images/authorPictures`

export function getArtworkUrl(song: Song | null | undefined): string | null {
  return song?.song_image
    ? `${artworkStorageUrl}/${encodeURIComponent(song.song_image)}`
    : null
}

export function getArtistArtworkUrl(song: Song | null | undefined): string | null {
  return song?.author_image
    ? `${artistArtworkStorageUrl}/${encodeURIComponent(song.author_image)}`
    : null
}
