import assert from 'node:assert/strict'
import test from 'node:test'

import { clearSession, readSession, saveSession } from '../src/modules/Auth/session-storage.ts'

function createStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues))

  return {
    getItem(key) {
      return values.get(key) ?? null
    },
    removeItem(key) {
      values.delete(key)
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
  }
}

test('sesja zapisuje i odczytuje token oraz identyfikator użytkownika', () => {
  const storage = createStorage()

  saveSession({ token: 'token-123', userId: 42 }, storage)

  assert.deepEqual(readSession(storage), { token: 'token-123', userId: '42' })
})

test('wyczyszczenie sesji usuwa wszystkie dane uwierzytelnienia', () => {
  const storage = createStorage({ jwt: 'token-123', user_id: '42' })

  clearSession(storage)

  assert.deepEqual(readSession(storage), { token: null, userId: null })
})

test('odczyt sesji poza przeglądarką zwraca pustą sesję', () => {
  assert.deepEqual(readSession(), { token: null, userId: null })
})
