import { requestJson } from '../../shared/api/request.js'

export async function fetchAuthorAlbums(token, signal) {
  const payload = await requestJson('/api/getAuthorsAlbums', { signal, token })
  return Array.isArray(payload?.data) ? payload.data : []
}

export function uploadSong(formData, token) {
  return requestJson('/api/saveSongInBase', {
    body: formData,
    method: 'POST',
    token,
  })
}
