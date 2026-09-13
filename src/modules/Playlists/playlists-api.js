import { requestJson } from '../../shared/api/request.js'

export async function fetchUserPlaylists(userId) {
  if (!userId) return []

  const payload = await requestJson('/api/playlists', {
    json: { id: userId },
    method: 'POST',
  })
  return Array.isArray(payload?.data) ? payload.data : []
}

export function createPlaylist({ name, trackIds }, token) {
  return requestJson('/api/createPlaylist', {
    json: {
      playlistName: name,
      songsToAddArray: trackIds,
    },
    method: 'POST',
    token,
  })
}

export function updatePlaylistTrack({ isIncluded, playlistId, trackId }, token) {
  const endpoint = isIncluded ? 'handleRemoveSong' : 'addSongToPlaylist'
  return requestJson(`/api/${endpoint}`, {
    json: {
      playlist_id: playlistId,
      song_id: trackId,
    },
    method: 'POST',
    token,
  })
}

export async function fetchPlaylistDetails(playlistId, signal) {
  const payload = await requestJson(`/api/getPlaylistData?id=${encodeURIComponent(playlistId)}`, { signal })
  return Array.isArray(payload?.data) ? payload.data : []
}
