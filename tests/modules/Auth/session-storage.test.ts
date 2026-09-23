import assert from 'node:assert/strict'
import test from 'node:test'

import { clearSession, readSession, saveSession } from '../../../src/modules/Auth/session-storage.ts'

function createStorage(initialValues: Record<string, string> = {}) {
  const values = new Map<string, string>(Object.entries(initialValues))

  return {
    getItem(key: string) {
      return values.get(key) ?? null
    },
    removeItem(key: string) {
      values.delete(key)
    },
    setItem(key: string, value: string) {
      values.set(key, String(value))
    },
  }
}

await test('sesja zapisuje i odczytuje token oraz identyfikator użytkownika', () => {
  const storage = createStorage()

  saveSession({ token: 'token-123', userId: 42 }, storage)

  assert.deepEqual(readSession(storage), { token: 'token-123', userId: '42' })
})

await test('wyczyszczenie sesji usuwa wszystkie dane uwierzytelnienia', () => {
  const storage = createStorage({ jwt: 'token-123', user_id: '42' })

  clearSession(storage)

  assert.deepEqual(readSession(storage), { token: null, userId: null })
})

await test('odczyt sesji poza przeglądarką zwraca pustą sesję', () => {
  assert.deepEqual(readSession(), { token: null, userId: null })
})
