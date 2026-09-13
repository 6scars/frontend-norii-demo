import { requestJson } from '../../shared/api/request.js'

export async function fetchSongs() {
  const payload = await requestJson('/api/fetchSongs')
  return Array.isArray(payload?.data) ? payload.data : []
}

export async function fetchSong(songId, signal) {
  const payload = await requestJson(`/api/getSong?id=${encodeURIComponent(songId)}`, { signal })
  return Array.isArray(payload?.data) ? payload.data[0] ?? null : null
}

export function recordSongView(songId, token) {
  return requestJson('/api/addView', {
    json: { song_id: songId },
    method: 'POST',
    token,
  })
}
