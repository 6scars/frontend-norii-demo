import { BACKEND_URL } from '../../config.ts'

interface RequestJsonOptions {
  body?: BodyInit | null
  headers?: HeadersInit
  json?: unknown
  method?: string
  signal?: AbortSignal
  token?: string | null
}

interface ErrorPayload {
  error?: {
    message?: unknown
  }
  message?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(message: string, status: number, payload: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function decodeResponse(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiError('Serwer zwrócił nieprawidłową odpowiedź', response.status)
  }
}

function getErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const errorPayload = payload as ErrorPayload
    if (typeof errorPayload.message === 'string') return errorPayload.message
    if (typeof errorPayload.error?.message === 'string') return errorPayload.error.message
  }

  return `Żądanie nie powiodło się (${status})`
}

export async function requestJson<T = unknown>(
  path: string,
  { body, headers, json, method = 'GET', signal, token }: RequestJsonOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers)
  let requestBody = body

  if (json !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(json)
  }
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`)

  const requestInit: RequestInit = {
    headers: requestHeaders,
    method,
  }
  if (requestBody !== undefined) requestInit.body = requestBody
  if (signal !== undefined) requestInit.signal = signal

  const response = await fetch(`${BACKEND_URL}${path}`, requestInit)
  const payload = await decodeResponse(response)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, response.status), response.status, payload)
  }

  return payload as T
}
