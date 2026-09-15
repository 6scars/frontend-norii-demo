import { requestJson } from '../../shared/api/request.ts'
import type { EntityId, MessageResponse } from '../../shared/types/domain.ts'

interface RawOwnedSong {
  id?: unknown
  songName?: unknown
  songImage?: unknown
  credit?: unknown
  createdAt?: unknown
  views?: unknown
}

export interface OwnedSong {
  id: string
  songName: string
  songImage: string | null
  credit: string | null
  createdAt: string | null
  views: number
}

export interface MySongsPage {
  data: OwnedSong[]
  nextCursor: string | null
}

interface MySongsResponse {
  data?: unknown
  nextCursor?: unknown
}

function normalizeSong(song: unknown): OwnedSong {
  if (
    !song
    || typeof song !== 'object'
    || !/^\d+$/.test(String((song as RawOwnedSong).id))
    || typeof (song as RawOwnedSong).songName !== 'string'
  ) {
    throw new Error('Serwer zwrócił nieprawidłową listę utworów.')
  }

  const rawSong = song as RawOwnedSong
  return {
    id: String(rawSong.id),
    songName: rawSong.songName as string,
    songImage: typeof rawSong.songImage === 'string' ? rawSong.songImage : null,
    credit: typeof rawSong.credit === 'string' ? rawSong.credit : null,
    createdAt: typeof rawSong.createdAt === 'string' ? rawSong.createdAt : null,
    views: Number.isFinite(Number(rawSong.views))
      ? Math.max(0, Number(rawSong.views))
      : 0,
  }
}

export async function fetchMySongs(
  token: string,
  cursor?: string | null,
  signal?: AbortSignal,
): Promise<MySongsPage> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  const options = {
    ...(signal ? { signal } : {}),
    token,
  }
  const payload = await requestJson<MySongsResponse>(`/api/my-songs${query}`, options)
  if (!Array.isArray(payload?.data)) {
    throw new Error('Serwer zwrócił nieprawidłową listę utworów.')
  }

  return {
    data: payload.data.map(normalizeSong),
    nextCursor: typeof payload.nextCursor === 'string' ? payload.nextCursor : null,
  }
}

export function deleteMySong(
  songId: EntityId,
  token: string,
): Promise<MessageResponse> {
  return requestJson<MessageResponse>(
    `/api/my-songs/${encodeURIComponent(String(songId))}`,
    {
      method: 'DELETE',
      token,
    },
  )
}

