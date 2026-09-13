export const normalizePlaylistText = (value) => String(value ?? '').trim().toLocaleLowerCase('pl')

export function getPlaylistSongCount(playlist) {
  const songIds = Array.isArray(playlist?.song_ids) ? playlist.song_ids : []
  return songIds.filter((songId) => songId !== null && songId !== undefined && songId !== 'NULL').length
}

export function getValidPlaylists(playlistsValue) {
  return Array.isArray(playlistsValue)
    ? playlistsValue.filter((playlist) => playlist?.playlist_id !== null && playlist?.playlist_id !== undefined && playlist?.playlist_name)
    : []
}

export function playlistContainsSong(playlist, song) {
  const songIds = Array.isArray(playlist?.song_ids) ? playlist.song_ids : []
  const songId = song?.song_id ?? song?.id
  if (songId === null || songId === undefined) return false
  return songIds.some((playlistSongId) => playlistSongId !== 'NULL' && String(playlistSongId) === String(songId))
}
