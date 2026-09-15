import { requestJson } from '../../shared/api/request.ts'
import type { EntityId, MessageResponse, Song } from '../../shared/types/domain.ts'

interface SongsResponse {
  data?: Song[]
}

export async function fetchSongs(): Promise<Song[]> {
  const payload = await requestJson<SongsResponse>('/api/fetchSongs')
  return Array.isArray(payload?.data) ? payload.data : []
}

export async function fetchSong(
  songId: EntityId,
  signal?: AbortSignal,
): Promise<Song | null> {
  const payload = await requestJson<SongsResponse>(
    `/api/getSong?id=${encodeURIComponent(String(songId))}`,
    signal ? { signal } : {},
  )
  return Array.isArray(payload?.data) ? payload.data[0] ?? null : null
}

export function recordSongView(
  songId: EntityId,
  token: string | null,
): Promise<MessageResponse> {
  return requestJson<MessageResponse>('/api/addView', {
    json: { song_id: songId },
    method: 'POST',
    token,
  })
}
