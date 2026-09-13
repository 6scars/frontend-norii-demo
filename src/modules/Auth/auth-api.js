import { requestJson } from '../../shared/api/request.js'

export function authenticate(mode, credentials) {
  const endpoint = mode === 'signup' ? 'newAccount' : 'signin'
  return requestJson(`/api/${endpoint}`, { json: credentials, method: 'POST' })
}

export async function validateSession(token) {
  if (!token) return false

  const payload = await requestJson('/api/checkToken', { method: 'POST', token })
  return Boolean(payload?.token)
}
