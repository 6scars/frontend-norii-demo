import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.ts'
import { readSession } from '../../modules/Auth/session-storage.ts'
import {
  PUBLISHING_POLICY_VERSION,
  getDemoPublishingNotice,
  validateAudioFile,
  validateImageFile,
  validateSongUpload,
} from '../../modules/Upload/song-upload.ts'
import { fetchAuthorAlbums, fetchDemoPublishingStatus, uploadSong } from '../../modules/Upload/upload-api.ts'
import Icon from '../../shared/ui/Icon.tsx'
import UploadField from './UploadField.tsx'
import UploadReview from './UploadReview.tsx'
import { getErrorMessage } from '../../shared/errors/get-error-message.ts'
import type { Album, DemoPublishingStatus, PublicationConsent } from '../../shared/types/domain.ts'
import type { SongUploadErrors } from '../../modules/Upload/song-upload.ts'
import type { SongForm } from './song-form.ts'
import './AddSong.css'

const steps = [
  { id: 'details', label: 'Informacje' },
  { id: 'files', label: 'Pliki' },
  { id: 'review', label: 'Podgląd' },
] as const

type UploadStep = (typeof steps)[number]['id']
type RequestStatus = 'idle' | 'pending' | 'success' | 'error'

function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setUrl(null)
      return undefined
    }
    const nextUrl = URL.createObjectURL(file)
    setUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [file])

  return url
}

export default function SongUpload() {
  const [activeStep, setActiveStep] = useState<UploadStep>('details')
  const [albumsInfo, setAlbumsInfo] = useState<Album[]>([])
  const [publishingStatus, setPublishingStatus] = useState<DemoPublishingStatus | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<SongUploadErrors>({})
  const [requestState, setRequestState] = useState<{ status: RequestStatus; message: string }>({ status: 'idle', message: '' })
  const [form, setForm] = useState<SongForm>({ song_name: '', credit: '', album_id: '', album_name: '' })
  const [publicationConsent, setPublicationConsent] = useState<PublicationConsent & { policyVersion: string }>({
    audioRightsConfirmed: false,
    coverRightsConfirmed: false,
    publishingTermsAccepted: false,
    policyVersion: PUBLISHING_POLICY_VERSION,
  })
  const audioUrl = useObjectUrl(audioFile)
  const imageUrl = useObjectUrl(imageFile)
  const { token } = readSession()
  const hasToken = Boolean(token)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPageData(authToken: string): Promise<void> {
      try {
        const [albums, status] = await Promise.all([
          fetchAuthorAlbums(authToken, controller.signal),
          fetchDemoPublishingStatus(authToken, controller.signal),
        ])
        if (!controller.signal.aborted) {
          setAlbumsInfo(albums)
          setPublishingStatus(status)
        }
      } catch (error) {
        if (!controller.signal.aborted) setRequestState({ status: 'error', message: getErrorMessage(error, 'Nie udało się pobrać danych publikacji') })
      }
    }

    if (token) void loadPageData(token)
    return () => controller.abort()
  }, [hasToken, token])

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const chooseAlbum = (event: ChangeEvent<HTMLSelectElement>) => {
    const albumId = event.target.value
    const album = albumsInfo.find((item) => String(item.id) === albumId)
    setForm((currentForm) => ({ ...currentForm, album_id: albumId, album_name: album?.album_name || '' }))
  }

  const chooseImage = (file: File) => {
    setImageFile(file)
    setErrors((current) => ({ ...current, imageFile: validateImageFile(file) }))
  }

  const chooseAudio = (file: File) => {
    setAudioFile(file)
    setErrors((current) => ({ ...current, audioFile: validateAudioFile(file) }))
  }

  const updatePublicationConsent = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.target
    setPublicationConsent((current) => ({ ...current, [name]: checked }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const sendSong = async () => {
    if (!token) return
    if (publishingStatus?.canPublish === false) {
      setRequestState({ status: 'error', message: publishingStatus.message ?? 'Limit publikacji wersji demonstracyjnej został wyczerpany.' })
      return
    }
    const validationErrors = validateSongUpload({
      ...form,
      audioFile,
      imageFile,
      publicationConsent,
    })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length || !audioFile || !imageFile) {
      setRequestState({ status: 'error', message: 'Popraw wskazane pola przed wysłaniem utworu.' })
      return
    }

    const legacyForm = {
      ...form,
      imgUrl: imageUrl,
      importedSongUrlBlob: audioUrl,
      importedSongNameFile: audioFile.name,
    }
    const formData = new FormData()
    Object.entries(legacyForm).forEach(([key, value]) => value && formData.append(key, value))
    formData.append('mp3', audioFile, audioFile.name)
    formData.append('img', imageFile, imageFile.name)
    formData.append('addSongForm', JSON.stringify(legacyForm))
    formData.append('publicationConsent', JSON.stringify(publicationConsent))
    setRequestState({ status: 'pending', message: '' })

    try {
      const data = await uploadSong(formData, token)
      setRequestState({ status: 'success', message: data.message || 'Utwór został przesłany.' })
      fetchDemoPublishingStatus(token)
        .then(setPublishingStatus)
        .catch(() => {})
    } catch (error) {
      setRequestState({ status: 'error', message: getErrorMessage(error, 'Nie udało się połączyć z serwerem.') })
      fetchDemoPublishingStatus(token)
        .then(setPublishingStatus)
        .catch(() => {})
    }
  }

  if (!hasToken) {
    return <main className="song-upload song-upload--guest"><Icon name="plus" size={38} /><h1>Zaloguj się, aby dodać utwór</h1><p>Przesyłanie muzyki jest dostępne dla zalogowanych użytkowników.</p><Link className="button button--primary" to={APP_ROUTES.home}>Wróć do aplikacji</Link></main>
  }

  return (
    <main className="song-upload">
      <aside className="song-upload__sidebar"><Link aria-label="Wróć do aplikacji" className="song-upload__back" to={APP_ROUTES.account}><Icon name="chevronLeft" size={18} /></Link><div className="song-upload__brand"><span /><strong>NORII</strong></div><nav aria-label="Etapy dodawania utworu">{steps.map((step, index) => <button aria-current={activeStep === step.id ? 'step' : undefined} key={step.id} onClick={() => setActiveStep(step.id)} type="button"><span>0{index + 1}</span>{step.label}</button>)}</nav><small>MP3 do 25 MB · JPG/PNG do 5 MB</small></aside>
      <section className="song-upload__workspace">
        <header><span>DODAJ NOWY UTWÓR</span><h1>Opublikuj muzykę</h1><p>Przygotuj informacje, zgodne pliki i wymagane oświadczenia przed wysłaniem.</p></header>

        {publishingStatus ? <div className={`song-upload__demo-notice${publishingStatus.canPublish ? '' : ' song-upload__demo-notice--blocked'}`} role={publishingStatus.canPublish ? 'note' : 'alert'}><strong>{getDemoPublishingNotice(publishingStatus)}</strong><p>{publishingStatus.message || `Wspólny limit plików dla wszystkich kont: ${Math.ceil(publishingStatus.storage.usedBytes / 1024 / 1024)} z ${Math.ceil(publishingStatus.storage.limitBytes / 1024 / 1024)} MiB.`}</p></div> : null}

        {activeStep === 'details' ? <div className="song-upload__panel upload-details"><label><span>Tytuł utworu *</span><input name="song_name" onChange={updateField} placeholder="Np. Cienie miasta" type="text" value={form.song_name} />{errors.song_name ? <em>{errors.song_name}</em> : null}</label><label><span>Opis / informacje o prawach</span><textarea name="credit" onChange={updateField} placeholder="Autorzy, producenci, prawa…" rows={4} value={form.credit} /></label><label><span>Połącz z albumem</span><select name="album_id" onChange={chooseAlbum} value={form.album_id}><option value="">Bez albumu</option>{albumsInfo.map((album) => <option key={album.id} value={album.id}>{album.album_name}</option>)}</select></label></div> : null}

        {activeStep === 'files' ? <div className="song-upload__panel upload-files"><div className="upload-files__requirements" role="note"><strong>Wymagania dotyczące plików</strong><p>Nagranie musi być plikiem MP3 do 25 MB. Okładka musi być plikiem JPG, JPEG lub PNG do 5 MB.</p></div><div className="upload-files__fields"><UploadField accept="image/jpeg,image/png,.jpg,.jpeg,.png" error={errors.imageFile} file={imageFile} hint="JPG, JPEG lub PNG · maks. 5 MB" id="song-cover" label="Dodaj okładkę" onFile={chooseImage} /><UploadField accept="audio/mpeg,.mp3" error={errors.audioFile} file={audioFile} hint="MP3 · maks. 25 MB" id="song-audio" label="Dodaj nagranie" onFile={chooseAudio} /></div></div> : null}

        {activeStep === 'review' ? <div className="song-upload__panel"><UploadReview audioUrl={audioUrl} consent={publicationConsent} errors={errors} form={form} imageUrl={imageUrl} onConsentChange={updatePublicationConsent} policyVersion={PUBLISHING_POLICY_VERSION} /></div> : null}

        <footer className="song-upload__footer"><div>{requestState.message ? <p className={`song-upload__message song-upload__message--${requestState.status}`} role="status">{requestState.message}</p> : null}</div><div><button className="button button--quiet" onClick={() => setActiveStep(steps[Math.max(0, steps.findIndex((step) => step.id === activeStep) - 1)]?.id ?? activeStep)} type="button">Wstecz</button>{activeStep !== 'review' ? <button className="button button--primary" onClick={() => setActiveStep(steps[Math.min(steps.length - 1, steps.findIndex((step) => step.id === activeStep) + 1)]?.id ?? activeStep)} type="button">Dalej</button> : <button className="button button--primary" disabled={requestState.status === 'pending' || publishingStatus?.canPublish === false} onClick={() => { void sendSong() }} type="button">{requestState.status === 'pending' ? 'Wysyłanie…' : 'Wyślij utwór'}</button>}</div></footer>
      </section>
    </main>
  )
}
