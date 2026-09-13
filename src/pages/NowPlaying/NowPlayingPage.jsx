import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { APP_ROUTES, getArtistRoute } from '../../app/routes.js'
import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.js'
import { buildNowPlayingModel } from '../../modules/Player/now-playing-model.js'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.js'
import Icon from '../../shared/ui/Icon.jsx'
import './NowPlayingPage.css'

const formatTime = (value) => {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  return `${minutes}:${Math.floor(value % 60).toString().padStart(2, '0')}`
}

export default function NowPlayingPage() {
  const navigate = useNavigate()
  const { songs } = useAuthContext()
  const { currentSong, playbackQueue, setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const {
    chooseSong,
    currentTime,
    duration,
    goToNext,
    goToPrevious,
    isPlaying,
    loop,
    muted,
    setAudioVolume,
    setCurrentTime,
    toggleLoop,
    toggleMute,
    togglePlay,
    volume,
  } = usePlayerContext()
  const model = useMemo(
    () => buildNowPlayingModel({ currentSong, playbackQueue, songs }),
    [currentSong, playbackQueue, songs],
  )
  const artwork = getArtworkUrl(model.activeSong)
  const narrative = model.activeSong?.lyrics || model.activeSong?.song_text || null

  const selectSong = async (song) => {
    const songId = getSongId(song)
    const index = model.queue.findIndex((item) => String(getSongId(item)) === String(songId))
    if (songId === null || index < 0) return
    setPlaybackQueue(model.queue)
    setCurrentTrackIndex(index)
    await chooseSong(songId)
  }

  const seek = (event) => {
    const nextTime = Number(event.target.value)
    setCurrentTime(nextTime)
  }

  return (
    <div className="now-playing-page">
      {artwork ? <img alt="" className="now-playing-page__backdrop" src={artwork} /> : null}
      <header className="now-playing-topbar">
        <button className="now-playing-back" onClick={() => navigate(-1)} type="button"><Icon name="chevronLeft" size={18} /> Powrót</button>
        <span>Teraz gra</span>
        <Link to={APP_ROUTES.home}>Zamknij</Link>
      </header>

      <div className="now-playing-layout">
        <main className="now-playing-main">
          {model.activeSong ? (
            <>
              <section aria-labelledby="now-playing-title" className="now-playing-artwork-section">
                <div className="now-playing-heading"><span>TERAZ GRA</span><h1 id="now-playing-title">{model.activeSong.song_name}</h1><Link to={getArtistRoute(model.activeSong.author)}>{model.activeSong.author}</Link></div>
                <div className="now-playing-cover">{artwork ? <img alt={`Okładka utworu ${model.activeSong.song_name}`} src={artwork} /> : <span>{model.activeSong.song_name.slice(0, 1)}</span>}</div>
                <div className="now-playing-progress">
                  <input aria-label="Pozycja utworu" disabled={!duration} max={duration || 0} min="0" onChange={seek} step="0.1" style={{ '--range-fill': `${duration ? (currentTime / duration) * 100 : 0}%` }} type="range" value={Math.min(currentTime, duration || 0)} />
                  <div><time>{formatTime(currentTime)}</time><time>{formatTime(duration)}</time></div>
                </div>
                <div className="now-playing-controls">
                  <button aria-label="Odtwarzanie losowe niedostępne" disabled title="Odtwarzanie losowe nie jest jeszcze obsługiwane" type="button"><Icon name="shuffle" size={20} /></button>
                  <button aria-label="Poprzedni utwór" onClick={goToPrevious} type="button"><Icon name="previous" size={26} /></button>
                  <button aria-label={isPlaying ? 'Wstrzymaj' : 'Odtwórz'} className="now-playing-controls__primary" onClick={togglePlay} type="button"><Icon name={isPlaying ? 'pause' : 'play'} size={30} /></button>
                  <button aria-label="Następny utwór" onClick={goToNext} type="button"><Icon name="next" size={26} /></button>
                  <button aria-label={loop ? 'Wyłącz powtarzanie' : 'Włącz powtarzanie'} aria-pressed={loop} onClick={toggleLoop} type="button"><Icon name="repeat" size={20} /></button>
                </div>
                <div className="now-playing-volume"><button aria-label={muted ? 'Włącz dźwięk' : 'Wycisz'} aria-pressed={muted} onClick={toggleMute} type="button"><Icon name="volume" size={20} /></button><input aria-label="Głośność" max="1" min="0" onChange={(event) => setAudioVolume(Number(event.target.value))} step="0.01" style={{ '--range-fill': `${volume * 100}%` }} type="range" value={volume} /></div>
              </section>

              <section aria-labelledby="now-playing-story" className="now-playing-story">
                <span className="now-playing-eyebrow">O UTWORZE</span>
                <h2 id="now-playing-story">{narrative ? 'Tekst' : 'Historia nagrania'}</h2>
                {narrative ? <p className="now-playing-story__lyrics">{narrative}</p> : <p className="now-playing-story__unavailable">Tekst utworu nie jest dostępny w aktualnych danych.</p>}
                {model.activeSong.biograph ? <div><span>O TWÓRCY</span><p>{model.activeSong.biograph}</p></div> : null}
                {model.activeSong.credit ? <div><span>CREDIT</span><p>{model.activeSong.credit}</p></div> : null}
              </section>
            </>
          ) : (
            <section className="now-playing-empty" role="status"><span className="now-playing-empty__disc"><Icon name="play" size={28} /></span><h1>Nic jeszcze nie gra</h1><p>Wybierz utwór z kolejki albo wróć do odkrywania muzyki.</p><Link className="button button--primary" to={APP_ROUTES.discover}>Odkrywaj</Link></section>
          )}
        </main>

        <aside aria-label="Kolejka odtwarzania" className="now-playing-queue">
          <div className="now-playing-queue__heading"><div><span>NASTĘPNE</span><h2>Kolejka</h2></div><strong>{model.queue.length}</strong></div>
          <div className="now-playing-queue__list">
            {model.queue.map((song, index) => {
              const songArtwork = getArtworkUrl(song)
              const isActive = index === model.activeIndex
              return <button aria-current={isActive ? 'true' : undefined} className={isActive ? 'now-playing-song now-playing-song--active' : 'now-playing-song'} key={`${getSongId(song)}-${index}`} onClick={() => selectSong(song)} type="button"><span className="now-playing-song__index">{isActive ? <span className="now-playing-song__bars"><i /><i /><i /></span> : index + 1}</span><span className="now-playing-song__cover">{songArtwork ? <img alt="" src={songArtwork} /> : song.song_name.slice(0, 1)}</span><span className="now-playing-song__copy"><strong>{song.song_name}</strong><small>{song.author}</small></span><Icon name="more" size={17} /></button>
            })}
          </div>
          <p>{model.queue.length ? `${model.queue.length} utworów w kolejce` : 'Kolejka jest pusta'}</p>
        </aside>
      </div>
    </div>
  )
}
