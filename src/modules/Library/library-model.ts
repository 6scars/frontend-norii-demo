import {
  getValidPlaylists,
  normalizePlaylistText,
} from '../Playlists/playlist-collection.ts'
import type { Playlist } from '../../shared/types/domain.ts'

export type LibrarySort = 'recent' | 'name'

interface LibraryOptions {
  query?: string
  sort?: LibrarySort
}

export interface LibraryModel {
  items: Playlist[]
  total: number
}

export function buildLibraryModel(
  playlistsValue: readonly (Playlist | null | undefined)[] | null | undefined,
  options: LibraryOptions = {},
): LibraryModel {
  const playlists = getValidPlaylists(playlistsValue)
  const query = normalizePlaylistText(options.query)
  const items = playlists.filter((playlist) =>
    normalizePlaylistText(playlist.playlist_name).includes(query),
  )

  if (options.sort === 'name') {
    items.sort((left, right) =>
      String(left.playlist_name).localeCompare(String(right.playlist_name), 'pl'),
    )
  }

  return { items, total: playlists.length }
}
