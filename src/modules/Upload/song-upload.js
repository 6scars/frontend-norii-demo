const imageTypes = new Set(['image/jpeg', 'image/png'])
const imageExtensions = ['.jpg', '.jpeg', '.png']

export const MAX_AUDIO_BYTES = 25 * 1024 * 1024
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const PUBLISHING_POLICY_VERSION = '2026-09-12-v1'

function hasExtension(fileName, extensions) {
  const normalizedName = String(fileName || '').toLocaleLowerCase()
  return extensions.some((extension) => normalizedName.endsWith(extension))
}

export function validateImageFile(file) {
  if (!file) return 'Dodaj okładkę w formacie JPG lub PNG.'
  if (!imageTypes.has(file.type) || !hasExtension(file.name, imageExtensions)) {
    return 'Okładka musi być plikiem JPG lub PNG.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Okładka jest za duża. Maksymalny rozmiar to 5 MB.'
  }
  return undefined
}

export function validateAudioFile(file) {
  if (!file) return 'Dodaj nagranie w formacie MP3.'
  if (file.type !== 'audio/mpeg' || !hasExtension(file.name, ['.mp3'])) {
    return 'Nagranie musi być plikiem MP3.'
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return 'Nagranie jest za duże. Maksymalny rozmiar to 25 MB.'
  }
  return undefined
}

export function validateSongUpload({
  audioFile,
  imageFile,
  publicationConsent = {},
  song_name,
}) {
  const errors = {}
  const imageError = validateImageFile(imageFile)
  const audioError = validateAudioFile(audioFile)

  if (String(song_name || '').trim().length < 5) errors.song_name = 'Tytuł musi mieć co najmniej 5 znaków.'
  if (imageError) errors.imageFile = imageError
  if (audioError) errors.audioFile = audioError
  if (!publicationConsent.audioRightsConfirmed) errors.audioRightsConfirmed = 'Potwierdź prawa do nagrania.'
  if (!publicationConsent.coverRightsConfirmed) errors.coverRightsConfirmed = 'Potwierdź prawa do okładki.'
  if (!publicationConsent.publishingTermsAccepted) errors.publishingTermsAccepted = 'Zaakceptuj zasady publikowania.'

  return errors
}

export function getDemoPublishingNotice(status) {
  const used = Number(status?.publications?.used ?? 0)
  const limit = Number(status?.publications?.limit ?? 2)
  const ttlMinutes = Number(status?.publicationTtlMinutes ?? 15)
  return `Wersja demonstracyjna: wykorzystano ${used} z ${limit} publikacji. Utwory i pliki są automatycznie usuwane po ${ttlMinutes} minutach.`
}
