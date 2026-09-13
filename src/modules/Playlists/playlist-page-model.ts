import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

export interface PlaylistPageModel {
  name: string
  tracks: Song[]
  total: number
}

export function buildPlaylistPageModel(
  playlistData: readonly (Song | null | undefined)[] | null | undefined,
): PlaylistPageModel {
  const source = playlistData ? playlistData.filter((row): row is Song => Boolean(row))
    : []
  const firstRow = source[0]
  const tracks = source.filter(
    (track) => getSongId(track) !== null && Boolean(track.song_name),
  )

  return {
    name: firstRow?.name || firstRow?.playlist_name || 'Playlista',
    tracks,
    total: tracks.length,
  }
}

