import type { EntityId, Session } from '../../shared/types/domain.ts'

const TOKEN_KEY = 'jwt'
const USER_ID_KEY = 'user_id'

function getBrowserStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function readSession(storage: Storage | null = getBrowserStorage()): Session {
  if (!storage) return { token: null, userId: null }

  return {
    token: storage.getItem(TOKEN_KEY),
    userId: storage.getItem(USER_ID_KEY),
  }
}

export function saveSession(
  { token, userId }: { token: string; userId: EntityId },
  storage: Storage | null = getBrowserStorage(),
): void {
  if (!storage) return
  if (!token || userId == null) throw new Error('Session requires a token and user id')

  storage.setItem(TOKEN_KEY, token)
  storage.setItem(USER_ID_KEY, String(userId))
}

export function clearSession(storage: Storage | null = getBrowserStorage()): void {
  if (!storage) return

  storage.removeItem(TOKEN_KEY)
  storage.removeItem(USER_ID_KEY)
}
