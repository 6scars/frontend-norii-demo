export function getSongId(song) {
  return song?.song_id ?? song?.id ?? null
}

const artworkStorageUrl = 'https://rgmmwhkixprkskznqjcy.supabase.co/storage/v1/object/public/spotify/images/songPictures'
const artistArtworkStorageUrl = 'https://rgmmwhkixprkskznqjcy.supabase.co/storage/v1/object/public/spotify/images/authorPictures'

export function getArtworkUrl(song) {
  return song?.song_image ? `${artworkStorageUrl}/${encodeURIComponent(song.song_image)}` : null
}

export function getArtistArtworkUrl(song) {
  return song?.author_image ? `${artistArtworkStorageUrl}/${encodeURIComponent(song.author_image)}` : null
}
