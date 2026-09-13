import { SUPABASE_STORAGE_URL } from '../../config.js'

export function getSongId(song) {
  return song?.song_id ?? song?.id ?? null
}

const artworkStorageUrl = `${SUPABASE_STORAGE_URL}/images/songPictures`
const artistArtworkStorageUrl = `${SUPABASE_STORAGE_URL}/images/authorPictures`

export function getArtworkUrl(song) {
  return song?.song_image ? `${artworkStorageUrl}/${encodeURIComponent(song.song_image)}` : null
}

export function getArtistArtworkUrl(song) {
  return song?.author_image ? `${artistArtworkStorageUrl}/${encodeURIComponent(song.author_image)}` : null
}
