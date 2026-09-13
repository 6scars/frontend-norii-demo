import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import { readSession } from '../../modules/Auth/session-storage.js'
import {
  PUBLISHING_POLICY_VERSION,
  validateAudioFile,
  validateImageFile,
  validateSongUpload,
} from '../../modules/Upload/song-upload.js'
import { fetchAuthorAlbums, uploadSong } from '../../modules/Upload/upload-api.js'
import Icon from '../../shared/ui/Icon.jsx'
import UploadField from './UploadField.jsx'
import UploadReview from './UploadReview.jsx'
import './AddSong.css'

const steps = [
  { id: 'details', label: 'Informacje' },
  { id: 'files', label: 'Pliki' },
  { id: 'review', label: 'Podgląd' },
]

function useObjectUrl(file) {
  const [url, setUrl] = useState(null)

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
  const [activeStep, setActiveStep] = useState('details')
  const [albumsInfo, setAlbumsInfo] = useState([])
  const [audioFile, setAudioFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [requestState, setRequestState] = useState({ status: 'idle', message: '' })
  const [form, setForm] = useState({ song_name: '', credit: '', album_id: '', album_name: '' })
  const [publicationConsent, setPublicationConsent] = useState({
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

    async function loadAlbums() {
      try {
        const albums = await fetchAuthorAlbums(token, controller.signal)
        if (!controller.signal.aborted) setAlbumsInfo(albums)
      } catch (error) {
        if (!controller.signal.aborted) setRequestState({ status: 'error', message: error.message })
      }
    }

    if (hasToken) loadAlbums()
    return () => controller.abort()
  }, [hasToken, token])

  const updateField = (event) => {
    const { name, value } = event.target
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }))
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const chooseAlbum = (event) => {
    const albumId = event.target.value
    const album = albumsInfo.find((item) => String(item.id) === albumId)
    setForm((currentForm) => ({ ...currentForm, album_id: albumId, album_name: album?.album_name || '' }))
  }

  const chooseImage = (file) => {
    setImageFile(file)
    setErrors((current) => ({ ...current, imageFile: validateImageFile(file) }))
  }

  const chooseAudio = (file) => {
    setAudioFile(file)
    setErrors((current) => ({ ...current, audioFile: validateAudioFile(file) }))
  }

  const updatePublicationConsent = (event) => {
    const { checked, name } = event.target
    setPublicationConsent((current) => ({ ...current, [name]: checked }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const sendSong = async () => {
    const validationErrors = validateSongUpload({
      ...form,
      audioFile,
      imageFile,
      publicationConsent,
    })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) {
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
    } catch (error) {
      setRequestState({ status: 'error', message: error.message || 'Nie udało się połączyć z serwerem.' })
    }
  }

  if (!hasToken) {
    return <main className="song-upload song-upload--guest"><Icon name="plus" size={38} /><h1>Zaloguj się, aby dodać utwór</h1><p>Przesyłanie muzyki jest dostępne dla uwierzytelnionych kont twórców.</p><Link className="button button--primary" to={APP_ROUTES.home}>Wróć do aplikacji</Link></main>
  }

  return (
    <main className="song-upload">
      <aside className="song-upload__sidebar"><Link aria-label="Wróć do aplikacji" className="song-upload__back" to={APP_ROUTES.account}><Icon name="chevronLeft" size={18} /></Link><div className="song-upload__brand"><span /><strong>NORII</strong></div><nav aria-label="Etapy dodawania utworu">{steps.map((step, index) => <button aria-current={activeStep === step.id ? 'step' : undefined} key={step.id} onClick={() => setActiveStep(step.id)} type="button"><span>0{index + 1}</span>{step.label}</button>)}</nav><small>MP3 do 25 MB · JPG/PNG do 5 MB</small></aside>
      <section className="song-upload__workspace">
        <header><span>DODAJ NOWY UTWÓR</span><h1>Opublikuj muzykę</h1><p>Przygotuj informacje, zgodne pliki i wymagane oświadczenia przed wysłaniem.</p></header>

        {activeStep === 'details' ? <div className="song-upload__panel upload-details"><label><span>Tytuł utworu *</span><input name="song_name" onChange={updateField} placeholder="Np. Cienie miasta" type="text" value={form.song_name} />{errors.song_name ? <em>{errors.song_name}</em> : null}</label><label><span>Opis / informacje o prawach</span><textarea name="credit" onChange={updateField} placeholder="Autorzy, producenci, prawa…" rows="4" value={form.credit} /></label><label><span>Połącz z albumem</span><select name="album_id" onChange={chooseAlbum} value={form.album_id}><option value="">Bez albumu</option>{albumsInfo.map((album) => <option key={album.id} value={album.id}>{album.album_name}</option>)}</select></label></div> : null}

        {activeStep === 'files' ? <div className="song-upload__panel upload-files"><div className="upload-files__requirements" role="note"><strong>Wymagania dotyczące plików</strong><p>Nagranie musi być plikiem MP3 do 25 MB. Okładka musi być plikiem JPG, JPEG lub PNG do 5 MB.</p></div><div className="upload-files__fields"><UploadField accept="image/jpeg,image/png,.jpg,.jpeg,.png" error={errors.imageFile} file={imageFile} hint="JPG, JPEG lub PNG · maks. 5 MB" id="song-cover" label="Dodaj okładkę" onFile={chooseImage} /><UploadField accept="audio/mpeg,.mp3" error={errors.audioFile} file={audioFile} hint="MP3 · maks. 25 MB" id="song-audio" label="Dodaj nagranie" onFile={chooseAudio} /></div></div> : null}

        {activeStep === 'review' ? <div className="song-upload__panel"><UploadReview audioUrl={audioUrl} consent={publicationConsent} errors={errors} form={form} imageUrl={imageUrl} onConsentChange={updatePublicationConsent} policyVersion={PUBLISHING_POLICY_VERSION} /></div> : null}

        <footer className="song-upload__footer"><div>{requestState.message ? <p className={`song-upload__message song-upload__message--${requestState.status}`} role="status">{requestState.message}</p> : null}</div><div><button className="button button--quiet" onClick={() => setActiveStep(steps[Math.max(0, steps.findIndex((step) => step.id === activeStep) - 1)].id)} type="button">Wstecz</button>{activeStep !== 'review' ? <button className="button button--primary" onClick={() => setActiveStep(steps[Math.min(steps.length - 1, steps.findIndex((step) => step.id === activeStep) + 1)].id)} type="button">Dalej</button> : <button className="button button--primary" disabled={requestState.status === 'pending'} onClick={sendSong} type="button">{requestState.status === 'pending' ? 'Wysyłanie…' : 'Wyślij utwór'}</button>}</div></footer>
      </section>
    </main>
  )
}
