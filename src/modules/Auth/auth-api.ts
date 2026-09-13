import { requestJson } from '../../shared/api/request.ts'
import type { AuthResponse } from '../../shared/types/domain.ts'

export type AuthMode = 'signin' | 'signup'

export interface Credentials {
  email: string
  password: string
}

export function authenticate(mode: AuthMode, credentials: Credentials): Promise<AuthResponse> {
  const endpoint = mode === 'signup' ? 'newAccount' : 'signin'
  return requestJson<AuthResponse>(`/api/${endpoint}`, { json: credentials, method: 'POST' })
}

export async function validateSession(token: string | null): Promise<boolean> {
  if (!token) return false

  const payload = await requestJson<{ token?: unknown }>('/api/checkToken', {
    method: 'POST',
    token,
  })
  return Boolean(payload?.token)
}
