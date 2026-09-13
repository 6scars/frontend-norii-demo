import { requestJson } from '../../shared/api/request.js'

function normalizeSong(song) {
  if (!song || typeof song !== 'object' || !/^\d+$/.test(String(song.id)) || typeof song.songName !== 'string') {
    throw new Error('Serwer zwrócił nieprawidłową listę utworów.')
  }
  return {
    id: String(song.id),
    songName: song.songName,
    songImage: typeof song.songImage === 'string' ? song.songImage : null,
    credit: typeof song.credit === 'string' ? song.credit : null,
    createdAt: typeof song.createdAt === 'string' ? song.createdAt : null,
    views: Number.isFinite(Number(song.views)) ? Math.max(0, Number(song.views)) : 0,
  }
}

export async function fetchMySongs(token, cursor, signal) {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  const payload = await requestJson(`/api/my-songs${query}`, { signal, token })
  if (!Array.isArray(payload?.data)) throw new Error('Serwer zwrócił nieprawidłową listę utworów.')
  return {
    data: payload.data.map(normalizeSong),
    nextCursor: payload.nextCursor == null ? null : String(payload.nextCursor),
  }
}

export function deleteMySong(songId, token) {
  return requestJson(`/api/my-songs/${encodeURIComponent(songId)}`, {
    method: 'DELETE',
    token,
  })
}
