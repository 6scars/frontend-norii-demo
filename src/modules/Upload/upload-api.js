import { requestJson } from '../../shared/api/request.js'

export async function fetchAuthorAlbums(token, signal) {
  const payload = await requestJson('/api/getAuthorsAlbums', { signal, token })
  return Array.isArray(payload?.data) ? payload.data : []
}

export async function fetchDemoPublishingStatus(token, signal) {
  const status = await requestJson('/api/demo-publishing-status', { signal, token })
  const hasValidShape = status?.isDemo === true
    && typeof status.canPublish === 'boolean'
    && Number.isFinite(status.publicationTtlMinutes)
    && Number.isFinite(status.publications?.used)
    && Number.isFinite(status.publications?.limit)
    && Number.isFinite(status.storage?.usedBytes)
    && Number.isFinite(status.storage?.limitBytes)

  if (!hasValidShape) throw new Error('Serwer zwrócił nieprawidłowy status publikowania.')
  return status
}

export function uploadSong(formData, token) {
  return requestJson('/api/saveSongInBase', {
    body: formData,
    method: 'POST',
    token,
  })
}
