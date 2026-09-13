import { BACKEND_URL } from '../../config.js'

export class ApiError extends Error {
  constructor(message, status, payload = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function decodeResponse(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    throw new ApiError('Serwer zwrócił nieprawidłową odpowiedź', response.status)
  }
}

export async function requestJson(path, { body, headers, json, method = 'GET', signal, token } = {}) {
  const requestHeaders = new Headers(headers)
  let requestBody = body

  if (json !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(json)
  }
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${BACKEND_URL}${path}`, {
    body: requestBody,
    headers: requestHeaders,
    method,
    signal,
  })
  const payload = await decodeResponse(response)

  if (!response.ok) {
    const message = payload?.message || payload?.error?.message || `Żądanie nie powiodło się (${response.status})`
    throw new ApiError(message, response.status, payload)
  }

  return payload
}
