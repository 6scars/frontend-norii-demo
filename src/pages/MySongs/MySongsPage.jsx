import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import { readSession } from '../../modules/Auth/session-storage.js'
import { deleteMySong, fetchMySongs } from '../../modules/MySongs/my-songs-api.js'
import { getArtworkUrl } from '../../modules/Catalog/song.js'
import Icon from '../../shared/ui/Icon.jsx'
import './MySongsPage.css'

const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function publicationDate(value) {
  if (!value) return 'Data niedostępna'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Data niedostępna' : dateFormatter.format(date)
}

export default function MySongsPage() {
  const { token } = readSession()
  const [songs, setSongs] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [status, setStatus] = useState(token ? 'loading' : 'guest')
  const [message, setMessage] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const confirmDeleteRef = useRef(null)

  useEffect(() => {
    if (!token) return undefined
    const controller = new AbortController()

    fetchMySongs(token, null, controller.signal)
      .then((result) => {
        setSongs(result.data)
        setNextCursor(result.nextCursor)
        setStatus('ready')
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setMessage(error.message)
          setStatus('error')
        }
      })
    return () => controller.abort()
  }, [token])

  useEffect(() => {
    if (!pendingDelete) return undefined
    confirmDeleteRef.current?.focus()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !deletingId) setPendingDelete(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [pendingDelete, deletingId])

  const loadMore = async () => {
    if (!nextCursor) return
    setStatus('loading-more')
    setMessage('')
    try {
      const result = await fetchMySongs(token, nextCursor)
      setSongs((current) => [...current, ...result.data])
      setNextCursor(result.nextCursor)
      setStatus('ready')
    } catch (error) {
      setMessage(error.message)
      setStatus('ready')
    }
  }

  const removeSong = async () => {
    if (!pendingDelete) return
    setDeletingId(pendingDelete.id)
    setMessage('')
    try {
      const result = await deleteMySong(pendingDelete.id, token)
      setSongs((current) => current.filter((song) => song.id !== pendingDelete.id))
      setMessage(result?.message || 'Utwór został usunięty.')
      setPendingDelete(null)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (!token) {
    return <section className="my-songs-page my-songs-page--center" role="status"><Icon name="library" size={38} /><h1>Zaloguj się, aby zobaczyć swoje utwory</h1><p>Publikacje twórcy są dostępne po poprawnym uwierzytelnieniu.</p><Link className="button button--primary" to={APP_ROUTES.account}>Przejdź do konta</Link></section>
  }

  return (
    <section className="my-songs-page">
      <header className="my-songs-heading"><div><span>TWOJE PUBLIKACJE</span><h1>Moje utwory</h1><p>Przeglądaj własne utwory i usuwaj publikacje wraz z ich plikami.</p></div><Link className="button button--primary" to={APP_ROUTES.addSong}><Icon name="plus" size={18} /> Dodaj utwór</Link></header>

      {message && status !== 'error' ? <p className="my-songs-message" role="status">{message}</p> : null}
      {status === 'loading' ? <div className="my-songs-page--center" role="status"><p>Ładowanie Twoich utworów…</p></div> : null}
      {status === 'error' ? <div className="my-songs-page--center" role="alert"><h2>Nie udało się pobrać utworów</h2><p>{message}</p></div> : null}
      {status !== 'loading' && status !== 'error' && songs.length === 0 ? <div className="my-songs-page--center" role="status"><Icon name="queue" size={40} /><h2>Nie masz jeszcze własnych utworów</h2><p>Opublikuj pierwszy utwór, a pojawi się w tym miejscu.</p><Link className="button button--primary" to={APP_ROUTES.addSong}>Dodaj utwór</Link></div> : null}

      {songs.length ? <div className="my-songs-list">{songs.map((song) => { const artwork = getArtworkUrl({ song_image: song.songImage }); return <article className="my-song" key={song.id}><div className="my-song__art">{artwork ? <img alt="" src={artwork} /> : <Icon name="queue" size={28} />}</div><div className="my-song__details"><strong>{song.songName}</strong><p>{song.credit || 'Bez dodatkowego opisu'}</p><small>Opublikowano {publicationDate(song.createdAt)} · {song.views} {song.views === 1 ? 'odsłuchanie' : 'odsłuchań'}</small></div><button className="button button--quiet my-song__delete" disabled={deletingId === song.id} onClick={() => setPendingDelete(song)} type="button">Usuń</button></article> })}</div> : null}

      {nextCursor ? <button className="button button--quiet my-songs-more" disabled={status === 'loading-more'} onClick={loadMore} type="button">{status === 'loading-more' ? 'Ładowanie…' : 'Pokaż więcej'}</button> : null}

      {pendingDelete ? <div className="my-songs-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !deletingId) setPendingDelete(null) }}><section aria-labelledby="delete-song-title" aria-modal="true" className="my-songs-dialog" role="dialog"><span>USUWANIE PUBLIKACJI</span><h2 id="delete-song-title">Usunąć „{pendingDelete.songName}”?</h2><p>Utwór zniknie z katalogu i playlist. Plik MP3 oraz nieużywana przez inne utwory okładka zostaną usunięte ze Storage.</p><div><button className="button button--quiet" disabled={Boolean(deletingId)} onClick={() => setPendingDelete(null)} type="button">Anuluj</button><button className="button button--primary" disabled={Boolean(deletingId)} onClick={removeSong} ref={confirmDeleteRef} type="button">{deletingId ? 'Usuwanie…' : 'Usuń utwór'}</button></div></section></div> : null}
    </section>
  )
}
