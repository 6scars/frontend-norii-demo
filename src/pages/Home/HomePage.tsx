import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.ts'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.ts'
import { useRecentlyPlayedContext } from '../../modules/RecentlyPlayed/useRecentlyPlayedContext.ts'
import Icon from '../../shared/ui/Icon.tsx'
import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.ts'
import { buildHomeModel } from '../../modules/Home/home-model.ts'
import type { HomeMix } from '../../modules/Home/home-model.ts'
import type { Song } from '../../shared/types/domain.ts'
import './HomePage.css'

interface ArtworkProps {
  song: Song | null
  className?: string
}

function Artwork({ song, className = '' }: ArtworkProps) {
  const src = getArtworkUrl(song)

  return (
    <div className={`home-artwork ${className}`}>
      {src ? <img alt="" src={src} /> : <span>{song?.song_name?.slice(0, 1) || 'M'}</span>}
    </div>
  )
}

interface HomeHeroProps {
  song: Song | null
  onPlay: (song: Song | null) => void
}

function HomeHero({ song, onPlay }: HomeHeroProps) {
  const src = getArtworkUrl(song)

  return (
    <section className="home-hero" aria-labelledby="featured-title">
      {src ? <img alt="" className="home-hero__backdrop" src={src} /> : null}
      <div className="home-hero__veil" />
      <div className="home-hero__content">
        <span className="home-eyebrow">PREMIERA</span>
        <h2 id="featured-title">{song?.song_name || 'Muzyka na tę chwilę'}</h2>
        <p className="home-hero__artist">{song?.author || 'Twoja kolekcja'}</p>
        <p className="home-hero__description">Odkryj brzmienie dobrane do nastroju i zostań z nim na dłużej.</p>
        <div className="home-hero__actions">
          <button className="button button--primary" disabled={!song} onClick={() => onPlay(song)} type="button">
            <Icon name="play" size={17} /> Odtwórz
          </button>
          <button className="button button--quiet" disabled title="Backend nie udostępnia jeszcze zapisywania ulubionych" type="button">Zapisz</button>
        </div>
      </div>
      <div aria-hidden="true" className="home-hero__pager"><i /><i /><i /><i /></div>
    </section>
  )
}

interface SongShelfProps {
  headingId: string
  songs: Song[]
  title: string
  onPlay: (song: Song, queue?: Song[]) => void
  viewAllTo?: string
}

function SongShelf({ headingId, songs, title, onPlay, viewAllTo }: SongShelfProps) {
  return (
    <section className="home-section" aria-labelledby={headingId}>
      <div className="home-section__heading">
        <h2 id={headingId}>{title}</h2>
        {viewAllTo ? <Link className="home-section__link" to={viewAllTo}>Pokaż wszystko</Link> : null}
      </div>
      <div className="home-cards">
        {songs.map((song, index) => (
          <button className="home-card" key={getSongId(song) ?? index} onClick={() => onPlay(song, songs)} type="button">
            <Artwork song={song} />
            <span className="home-card__shade" />
            <span className="home-card__copy">
              <strong>{song.song_name}</strong>
              <small>{song.author}</small>
            </span>
            <span className="home-card__play"><Icon name="play" size={16} /></span>
          </button>
        ))}
      </div>
    </section>
  )
}

interface MixShelfProps {
  mixes: HomeMix[]
  onPlay: (mix: HomeMix) => void
}

function MixShelf({ mixes, onPlay }: MixShelfProps) {
  return (
    <section className="home-section" aria-labelledby="mixes-title">
      <div className="home-section__heading">
        <h2 id="mixes-title">Twoje miksy</h2>
        <Link className="home-section__link" to={APP_ROUTES.radio}>Pokaż wszystko</Link>
      </div>
      <div className="home-mixes">
        {mixes.map((mix) => (
          <button className="home-mix" key={mix.title} onClick={() => onPlay(mix)} type="button">
            <span>
              <strong>{mix.title}</strong>
              <small>{mix.subtitle}</small>
            </span>
            <span className="home-mix__play"><Icon name="play" size={16} /></span>
          </button>
        ))}
      </div>
    </section>
  )
}

interface HomePageProps {
  songs?: Song[]
}

export default function HomePage({ songs: songsFromParent }: HomePageProps = {}) {
  const { songs: songsFromContext } = useAuthContext()
  const { recentlyPlayed } = useRecentlyPlayedContext()
  const { chooseSong } = usePlayerContext()
  const { setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const model = useMemo(
    () => buildHomeModel(songsFromParent || songsFromContext || [], recentlyPlayed),
    [songsFromParent, songsFromContext, recentlyPlayed],
  )

  const playSong = (song: Song | null, queue: Song[] = model.selected) => {
    const id = getSongId(song)
    if (id === null) return
    const index = queue.findIndex((item) => getSongId(item) === id)
    setPlaybackQueue(queue)
    setCurrentTrackIndex(index >= 0 ? index : 0)
    void chooseSong(id)
  }

  const playMix = (mix: HomeMix) => {
    const first = mix.tracks[0]
    const id = getSongId(first)
    if (id === null) return
    setPlaybackQueue(mix.tracks)
    setCurrentTrackIndex(0)
    void chooseSong(id)
  }

  return (
    <div className="home-page">
      <header className="home-page__intro">
        <div>
          <h1>Dzień dobry</h1>
          <p>Muzyka dopasowana do nastroju i chwili.</p>
        </div>
      </header>
      <HomeHero onPlay={playSong} song={model.featured} />
      {model.recent.length ? (
        <SongShelf headingId="recent-title" onPlay={playSong} songs={model.recent} title="Ostatnie" />
      ) : null}
      {model.selected.length ? (
        <SongShelf
          headingId="selected-title"
          onPlay={playSong}
          songs={model.selected}
          title="Wybrane dla Ciebie"
          viewAllTo={APP_ROUTES.discover}
        />
      ) : <div className="home-empty">Ładowanie muzyki…</div>}
      {model.mixes.length ? <MixShelf mixes={model.mixes} onPlay={playMix} /> : null}
    </div>
  )
}
