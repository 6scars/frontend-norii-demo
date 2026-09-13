import { requestJson } from '../../shared/api/request.js'

export const USERNAME_MAX_LENGTH = 50

export async function updateUsername(username, token) {
  const normalizedUsername = String(username ?? '').trim()

  if (!normalizedUsername) throw new Error('Nazwa użytkownika jest wymagana')
  if (normalizedUsername.length > USERNAME_MAX_LENGTH) {
    throw new Error(`Nazwa użytkownika może mieć maksymalnie ${USERNAME_MAX_LENGTH} znaków`)
  }
  if (!token) throw new Error('Brak aktywnej sesji')

  return requestJson('/api/updateUsername', {
    json: { username: normalizedUsername },
    method: 'POST',
    token,
  })
}
