import { requestJson } from '../../shared/api/request.ts'
import type {
  Album,
  DemoPublishingStatus,
  MessageResponse,
} from '../../shared/types/domain.ts'

interface AlbumsResponse {
  data?: Album[]
}

interface RawDemoPublishingStatus {
  isDemo?: unknown
  message?: unknown
  canPublish?: unknown
  publicationTtlMinutes?: unknown
  publications?: {
    used?: unknown
    limit?: unknown
  }
  storage?: {
    usedBytes?: unknown
    limitBytes?: unknown
  }
}

export async function fetchAuthorAlbums(
  token: string,
  signal?: AbortSignal,
): Promise<Album[]> {
  const payload = await requestJson<AlbumsResponse>(
    '/api/getAuthorsAlbums',
    { ...(signal ? { signal } : {}), token },
  )
  return Array.isArray(payload?.data) ? payload.data : []
}

export async function fetchDemoPublishingStatus(
  token: string,
  signal?: AbortSignal,
): Promise<DemoPublishingStatus> {
  const status = await requestJson<RawDemoPublishingStatus>(
    '/api/demo-publishing-status',
    { ...(signal ? { signal } : {}), token },
  )
  const hasValidShape = status?.isDemo === true
    && typeof status.canPublish === 'boolean'
    && Number.isFinite(status.publicationTtlMinutes)
    && Number.isFinite(status.publications?.used)
    && Number.isFinite(status.publications?.limit)
    && Number.isFinite(status.storage?.usedBytes)
    && Number.isFinite(status.storage?.limitBytes)

  if (!hasValidShape) {
    throw new Error('Serwer zwrócił nieprawidłowy status publikowania.')
  }

  return {
    ...status,
    ...(typeof status.message === 'string' ? { message: status.message } : {}),
  } as DemoPublishingStatus
}

export function uploadSong(
  formData: FormData,
  token: string,
): Promise<MessageResponse> {
  return requestJson<MessageResponse>('/api/saveSongInBase', {
    body: formData,
    method: 'POST',
    token,
  })
}
