import { getValidPlaylists, normalizePlaylistText } from './playlist-collection.js'

export function buildPlaylistOverview(playlistsValue, queryValue) {
  const playlists = getValidPlaylists(playlistsValue)
  const query = normalizePlaylistText(queryValue)

  return {
    featured: playlists[0] ?? null,
    items: playlists.filter((playlist) => normalizePlaylistText(playlist.playlist_name).includes(query)),
    total: playlists.length,
  }
}
