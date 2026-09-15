import { requestJson } from '../../shared/api/request.ts'
import type { MessageResponse } from '../../shared/types/domain.ts'

export const USERNAME_MAX_LENGTH = 50

export async function updateUsername(
  username: string,
  token: string | null,
): Promise<MessageResponse> {
  const normalizedUsername = username.trim()

  if (!normalizedUsername) throw new Error('Nazwa użytkownika jest wymagana')
  if (normalizedUsername.length > USERNAME_MAX_LENGTH) {
    throw new Error(`Nazwa użytkownika może mieć maksymalnie ${USERNAME_MAX_LENGTH} znaków`)
  }
  if (!token) throw new Error('Brak aktywnej sesji')

  return requestJson<MessageResponse>('/api/updateUsername', {
    json: { username: normalizedUsername },
    method: 'POST',
    token,
  })
}
