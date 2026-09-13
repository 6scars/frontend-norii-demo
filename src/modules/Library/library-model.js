import { getValidPlaylists, normalizePlaylistText } from '../Playlists/playlist-collection.js'

export function buildLibraryModel(playlistsValue, options = {}) {
  const playlists = getValidPlaylists(playlistsValue)
  const query = normalizePlaylistText(options.query)
  const items = playlists.filter((playlist) => normalizePlaylistText(playlist.playlist_name).includes(query))

  if (options.sort === 'name') {
    items.sort((left, right) => left.playlist_name.localeCompare(right.playlist_name, 'pl'))
  }

  return { items, total: playlists.length }
}
