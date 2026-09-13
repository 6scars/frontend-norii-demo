import { getSongId } from '../Catalog/song.js'

export function buildPlaylistPageModel(playlistData) {
  const source = Array.isArray(playlistData) ? playlistData : []
  const firstRow = source[0]
  const tracks = source.filter((track) => getSongId(track) !== null && Boolean(track?.song_name))

  return {
    name: firstRow?.name || firstRow?.playlist_name || 'Playlista',
    tracks,
    total: tracks.length,
  }
}
