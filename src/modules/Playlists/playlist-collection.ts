import type { Playlist, Song } from '../../shared/types/domain.ts'

export const normalizePlaylistText = (value: string | null | undefined): string =>
  String(value ?? '').trim().toLocaleLowerCase('pl')

export function getPlaylistSongCount(
  playlist: Playlist | null | undefined,
): number {
  const songIds = Array.isArray(playlist?.song_ids) ? playlist.song_ids : []
  return songIds.filter(
    (songId) => songId !== null && songId !== undefined && songId !== 'NULL',
  ).length
}

function isValidPlaylist(
  playlist: Playlist | null | undefined,
): playlist is Playlist {
  return Boolean(
    playlist
    && playlist.playlist_id !== null
    && playlist.playlist_id !== undefined
    && playlist.playlist_name,
  )
}

export function getValidPlaylists(
  playlistsValue: readonly (Playlist | null | undefined)[] | null | undefined,
): Playlist[] {
  return playlistsValue ? playlistsValue.filter(isValidPlaylist)
    : []
}

export function playlistContainsSong(
  playlist: Playlist | null | undefined,
  song: Song | null | undefined,
): boolean {
  const songIds = Array.isArray(playlist?.song_ids) ? playlist.song_ids : []
  const songId = song?.song_id ?? song?.id
  if (songId === null || songId === undefined) return false

  return songIds.some(
    (playlistSongId) =>
      playlistSongId !== 'NULL' && String(playlistSongId) === String(songId),
  )
}

