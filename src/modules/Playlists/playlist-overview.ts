import {
  getValidPlaylists,
  normalizePlaylistText,
} from './playlist-collection.ts'
import type { Playlist } from '../../shared/types/domain.ts'
import type { ValidPlaylist } from './playlist-collection.ts'

export interface PlaylistOverview {
  featured: ValidPlaylist | null
  items: ValidPlaylist[]
  total: number
}

export function buildPlaylistOverview(
  playlistsValue: readonly (Playlist | null | undefined)[] | null | undefined,
  queryValue: string | null | undefined,
): PlaylistOverview {
  const playlists = getValidPlaylists(playlistsValue)
  const query = normalizePlaylistText(queryValue)

  return {
    featured: playlists[0] ?? null,
    items: playlists.filter((playlist) =>
      normalizePlaylistText(playlist.playlist_name).includes(query),
    ),
    total: playlists.length,
  }
}

