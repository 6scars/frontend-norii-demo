import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../../modules/Auth/useAuthContext.ts'
import { readSession } from '../../../modules/Auth/session-storage.ts'
import { createPlaylist } from '../../../modules/Playlists/playlists-api.ts'
import { useUIStateContext } from '../../../modules/UIState/useUIStateContext.ts'
import Icon from '../../../shared/ui/Icon.tsx'

import './CreatePlaylist.css'

const MAX_COVER_SIZE = 5 * 1024 * 1024
const SUPPORTED_COVER_TYPES = new Set(['image/jpeg', 'image/png'])

type Visibility = 'private' | 'public'

export default function CreatePlaylist() {
  const navigate = useNavigate()
  const { refreshPlaylists } = useAuthContext()
  const { setCreatePlaylistOpen } = useUIStateContext()
  const [coverError, setCoverError] = useState('')
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameError, setNameError] = useState('')
  const [playlistName, setPlaylistName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [visibility, setVisibility] = useState<Visibility | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const redirectTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
  }, [coverPreview])

  useEffect(() => () => {
    if (redirectTimerRef.current !== null) window.clearTimeout(redirectTimerRef.current)
  }, [])

  const close = () => {
    setCreatePlaylistOpen(false)
    void navigate('/', { replace: true })
  }

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (!file) return

    if (!SUPPORTED_COVER_TYPES.has(file.type)) {
      setCoverError('Wybierz plik JPG lub PNG.')
      event.currentTarget.value = ''
      return
    }
    if (file.size > MAX_COVER_SIZE) {
      setCoverError('Okładka może mieć maksymalnie 5 MB.')
      event.currentTarget.value = ''
      return
    }

    setCoverError('')
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const normalizedName = playlistName.trim()
    if (!normalizedName) {
      setNameError('Nazwa playlisty jest wymagana.')
      nameInputRef.current?.focus()
      return
    }

    setErrorMessage('')
    setNameError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await createPlaylist({ name: normalizedName, trackIds: [] }, readSession().token)
      setSuccessMessage('Playlista została utworzona.')
      setIsSubmitting(false)
      void refreshPlaylists().catch((error: unknown) => {
        console.error('REFRESH PLAYLISTS ERROR', error)
      })
      redirectTimerRef.current = window.setTimeout(close, 2000)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się utworzyć playlisty.')
      setIsSubmitting(false)
    }
  }

  const isComplete = Boolean(successMessage)
  const isLocked = isSubmitting || isComplete

  return (
    <section className="create-playlist-page" aria-labelledby="create-playlist-title">
      <header className="create-playlist-page__heading">
        <span>NOWA KOLEKCJA</span>
        <h1 id="create-playlist-title">Stwórz playlistę</h1>
        <p>Utwórz nową kolekcję swoich utworów.</p>
      </header>

      <form aria-busy={isSubmitting} className="create-playlist-panel" onSubmit={(event) => { void handleSubmit(event) }} noValidate>
        <div className="create-playlist-cover">
          <div className={`create-playlist-cover__preview ${coverPreview ? 'create-playlist-cover__preview--selected' : ''}`}>
            {coverPreview
              ? <img alt="Podgląd okładki playlisty" src={coverPreview} />
              : <><Icon name="playlists" size={42} /><span>Okładka playlisty</span></>}
          </div>
          <label className="create-playlist-cover__button">
            <Icon name="plus" size={18} />
            <span>{coverPreview ? 'Zmień okładkę' : 'Dodaj okładkę'}</span>
            <input accept="image/jpeg,image/png" disabled={isLocked} onChange={handleCoverChange} type="file" />
          </label>
          <small>JPG lub PNG, maks. 5 MB. Okładka jest tylko lokalnym podglądem.</small>
          {coverError ? <p className="create-playlist-message create-playlist-message--error" role="alert">{coverError}</p> : null}
        </div>

        <div className="create-playlist-fields">
          <label className="create-playlist-field" htmlFor="playlist-name">
            <span>Nazwa playlisty <strong aria-hidden="true">*</strong></span>
            <input
              aria-describedby={nameError ? 'playlist-name-error' : undefined}
              aria-invalid={Boolean(nameError)}
              autoComplete="off"
              disabled={isLocked}
              id="playlist-name"
              onChange={(event) => {
                setPlaylistName(event.target.value)
                if (nameError && event.target.value.trim()) setNameError('')
              }}
              placeholder="Np. Nocne odkrycia"
              ref={nameInputRef}
              type="text"
              value={playlistName}
            />
          </label>
          {nameError ? <p className="create-playlist-field__error" id="playlist-name-error" role="alert">{nameError}</p> : null}

          <fieldset className="create-playlist-visibility" disabled={isLocked}>
            <legend>Widoczność</legend>
            <p>Wybór jest tymczasowy i nie jest jeszcze zapisywany.</p>
            <div>
              <label className={visibility === 'private' ? 'create-playlist-visibility__option create-playlist-visibility__option--selected' : 'create-playlist-visibility__option'}>
                <input checked={visibility === 'private'} name="visibility" onChange={() => setVisibility('private')} type="radio" />
                <span><strong>Prywatna</strong><small>Tylko Ty możesz ją zobaczyć</small></span>
              </label>
              <label className={visibility === 'public' ? 'create-playlist-visibility__option create-playlist-visibility__option--selected' : 'create-playlist-visibility__option'}>
                <input checked={visibility === 'public'} name="visibility" onChange={() => setVisibility('public')} type="radio" />
                <span><strong>Publiczna</strong><small>Każdy może ją zobaczyć</small></span>
              </label>
            </div>
          </fieldset>

          <div aria-live="polite" className="create-playlist-status">
            {successMessage ? <p className="create-playlist-message create-playlist-message--success" role="status">{successMessage}</p> : null}
            {errorMessage ? <p className="create-playlist-message create-playlist-message--error" role="alert">{errorMessage}</p> : null}
          </div>

          <div className="create-playlist-actions">
            <span>0 utworów</span>
            <div>
              <button className="create-playlist-button create-playlist-button--quiet" disabled={isLocked} onClick={close} type="button">Anuluj</button>
              <button className="create-playlist-button create-playlist-button--primary" disabled={isLocked} type="submit">
                {isSubmitting
                  ? <><span aria-hidden="true" className="create-playlist-button__spinner" /> Tworzenie…</>
                  : isComplete ? 'Utworzono' : 'Utwórz playlistę'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
