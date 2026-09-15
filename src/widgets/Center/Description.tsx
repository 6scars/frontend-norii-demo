import { useState } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES, getArtistRoute } from '../../app/routes.ts'
import { getArtworkUrl, getArtistArtworkUrl } from '../../modules/Catalog/song.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.ts'
import Icon from '../../shared/ui/Icon.tsx'
import AddTrackToPlaylist from '../Play/PlayLeftSection/AddSong.tsx'
import type { Song } from '../../shared/types/domain.ts'
import './Description.css'

interface DescriptionArtworkProps {
  src: string | null
  label: string
  className: string
}

function DescriptionArtwork({ src, label, className }: DescriptionArtworkProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={className}>
      {src && !failed ? <img alt={label} src={src} onError={() => setFailed(true)} />
        : <span aria-label={label} role="img"><Icon name="radio" size={40} /></span>}
    </div>
  )
}

interface DescriptionProps {
  song: Song
  onNavigate: () => void
}

export default function Description({ song, onNavigate }: DescriptionProps) {
  const { duration } = usePlayerContext()
  const { isAuthenticated } = useAuthContext()
  const [showPlaylists, setShowPlaylists] = useState(false)
  const durationText = duration > 0 && Number.isFinite(duration)
    ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : null
  const views = song.views == null ? null : Number(song.views)

  return (
    <div className="description">
      <DescriptionArtwork className="description__cover" label={`Okładka utworu ${song.song_name}`} src={getArtworkUrl(song)} />
      <section className="description__track" aria-labelledby="description-track-title">
        <span className="description__eyebrow">TERAZ SŁUCHASZ</span>
        <h3 id="description-track-title">{song.song_name}</h3>
        <Link onClick={onNavigate} to={getArtistRoute(song.author ?? '')}>{song.author}</Link>
        <div className="description__metadata">
          {views !== null && Number.isFinite(views) ? <span>{views.toLocaleString('pl-PL')} odtworzeń</span> : null}
          {durationText ? <time>{durationText}</time> : null}
        </div>
        <div className="description__actions">
          {isAuthenticated ? (
            <button aria-expanded={showPlaylists} className="description__playlist-button" onClick={() => setShowPlaylists(!showPlaylists)} type="button">
              <Icon name="plus" size={18} /> {showPlaylists ? 'Zamknij wybór' : 'Dodaj do playlisty'}
            </button>
          ) : <Link className="description__playlist-button" onClick={onNavigate} to={APP_ROUTES.signIn}><Icon name="plus" size={18} /> Zaloguj się, aby zapisać</Link>}
          <button aria-label="Ulubione — funkcja jeszcze niedostępna" className="description__favorite" disabled title="Zapisywanie ulubionych nie jest jeszcze obsługiwane" type="button"><Icon name="heart" size={20} /></button>
        </div>
        {showPlaylists ? (
          <div className="description__playlists" onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              setShowPlaylists(false)
              event.currentTarget.previousElementSibling?.querySelector<HTMLButtonElement>('button')?.focus()
            }
          }}>
            <AddTrackToPlaylist currentSong={song} isOpen />
          </div>
        ) : null}
      </section>
      <section className="description__artist" aria-labelledby="description-artist-heading">
        <div className="description__section-heading"><h3 id="description-artist-heading">O wykonawcy</h3><span>ARTYSTA</span></div>
        <Link className="description__artist-link" onClick={onNavigate} to={getArtistRoute(song.author ?? '')}>
          <DescriptionArtwork className="description__avatar" label="" src={getArtistArtworkUrl(song)} />
          <span><strong>{song.author}</strong><small>Zobacz profil wykonawcy</small></span>
          <Icon name="chevronRight" size={18} />
        </Link>
        <p>{song.biograph || 'Wykonawca nie dodał jeszcze opisu.'}</p>
        {song.follows != null && Number.isFinite(Number(song.follows)) ? <small>Obserwujący: {Number(song.follows).toLocaleString('pl-PL')}</small> : null}
      </section>
      <section className="description__credits" aria-labelledby="description-credits-heading">
        <div className="description__section-heading"><h3 id="description-credits-heading">Twórcy i prawa</h3><span>CREDITS</span></div>
        <p>{song.credit || 'Informacje o autorstwie nie zostały jeszcze udostępnione.'}</p>
      </section>
      <Link className="description__full-player" onClick={onNavigate} to={APP_ROUTES.nowPlaying}>Pełny odtwarzacz <Icon name="chevronRight" size={17} /></Link>
    </div>
  )
}
