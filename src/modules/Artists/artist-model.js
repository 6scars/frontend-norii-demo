import { getSongId } from '../Catalog/song.js'

const normalizeArtistName = (value) => String(value || '').trim().toLocaleLowerCase('pl')

export function buildArtistModel(songs, artistName) {
  const requestedName = String(artistName || '').trim()
  const normalizedName = normalizeArtistName(requestedName)
  const tracks = Array.isArray(songs)
    ? songs.filter((song) => getSongId(song) !== null && normalizeArtistName(song?.author) === normalizedName)
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
