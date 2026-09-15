import type {
  DemoPublishingStatus,
  PublicationConsent,
} from '../../shared/types/domain.ts'

const imageTypes = new Set(['image/jpeg', 'image/png'])
const imageExtensions = ['.jpg', '.jpeg', '.png'] as const

export const MAX_AUDIO_BYTES = 25 * 1024 * 1024
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const PUBLISHING_POLICY_VERSION = '2026-09-12-v1'

export type UploadFileInfo = Pick<File, 'name' | 'type' | 'size'>

export interface SongUploadInput {
  audioFile: UploadFileInfo | null
  imageFile: UploadFileInfo | null
  publicationConsent?: Partial<PublicationConsent>
  song_name: string
}

export type SongUploadErrors = Partial<
  Record<
    | 'audioFile'
    | 'audioRightsConfirmed'
    | 'coverRightsConfirmed'
    | 'imageFile'
    | 'publishingTermsAccepted'
    | 'song_name',
    string | undefined
  >
>

function hasExtension(
  fileName: string,
  extensions: readonly string[],
): boolean {
  const normalizedName = fileName.toLocaleLowerCase()
  return extensions.some((extension) => normalizedName.endsWith(extension))
}

export function validateImageFile(file: UploadFileInfo | null): string | undefined {
  if (!file) return 'Dodaj okładkę w formacie JPG lub PNG.'
  if (!imageTypes.has(file.type) || !hasExtension(file.name, imageExtensions)) {
    return 'Okładka musi być plikiem JPG lub PNG.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Okładka jest za duża. Maksymalny rozmiar to 5 MB.'
  }
  return undefined
}

export function validateAudioFile(file: UploadFileInfo | null): string | undefined {
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
}: SongUploadInput): SongUploadErrors {
  const errors: SongUploadErrors = {}
  const imageError = validateImageFile(imageFile)
  const audioError = validateAudioFile(audioFile)

  if (song_name.trim().length < 5) {
    errors.song_name = 'Tytuł musi mieć co najmniej 5 znaków.'
  }
  if (imageError) errors.imageFile = imageError
  if (audioError) errors.audioFile = audioError
  if (!publicationConsent.audioRightsConfirmed) {
    errors.audioRightsConfirmed = 'Potwierdź prawa do nagrania.'
  }
  if (!publicationConsent.coverRightsConfirmed) {
    errors.coverRightsConfirmed = 'Potwierdź prawa do okładki.'
  }
  if (!publicationConsent.publishingTermsAccepted) {
    errors.publishingTermsAccepted = 'Zaakceptuj zasady publikowania.'
  }

  return errors
}

export function getDemoPublishingNotice(status: Pick<DemoPublishingStatus, 'publicationTtlMinutes' | 'publications'>): string {
  const used = Number(status.publications.used)
  const limit = Number(status.publications.limit)
  const ttlMinutes = Number(status.publicationTtlMinutes)
  return `Wersja demonstracyjna: wykorzystano ${used} z ${limit} publikacji. Utwory i pliki są automatycznie usuwane po ${ttlMinutes} minutach.`
}
