import { Link, useParams } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import { usePlaylistDetails } from '../../modules/Playlists/usePlaylistDetails.js'
import Icon from '../../shared/ui/Icon.jsx'
import TrackTable from '../../widgets/Tracks/TrackTable.jsx'
import './PlaylistPage.css'

export default function PlaylistPage() {
  const { playlistId } = useParams()
  const { currentSong, error, isLoading, model, playAll, playTrack } = usePlaylistDetails(playlistId)
  const artwork = getArtworkUrl(model.tracks[0])

  if (isLoading) {
    return (
      <section aria-busy="true" aria-label="Ładowanie playlisty" className="playlist-page playlist-page--loading">
        <span className="playlist-page__skeleton playlist-page__skeleton--art" />
        <span className="playlist-page__skeleton playlist-page__skeleton--copy" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="playlist-page playlist-page--state" role="alert">
        <Icon name="playlists" size={36} />
        <h1>Nie udało się otworzyć playlisty</h1>
        <p>{error}</p>
        <Link className="button button--quiet" to={APP_ROUTES.playlists}>Wróć do playlist</Link>
      </section>
    )
  }

  return (
    <div className="playlist-page">
      <Link className="playlist-page__back" to={APP_ROUTES.playlists}><Icon name="chevronLeft" size={17} /> Wszystkie playlisty</Link>
      <header className="playlist-page__hero">
        <span className="playlist-page__art">{artwork ? <img alt="" src={artwork} /> : <Icon name="playlists" size={48} />}</span>
        <div className="playlist-page__copy">
          <span className="playlist-page__eyebrow">PLAYLISTA</span>
          <h1>{model.name}</h1>
          <p>{model.total} {model.total === 1 ? 'utwór' : 'utworów'} · Twoja prywatna kolekcja</p>
          <button className="button button--primary" disabled={!model.total} onClick={playAll} type="button"><Icon name="play" size={16} /> Odtwórz</button>
        </div>
      </header>
      <section aria-labelledby="playlist-tracks" className="playlist-page__tracks">
        <div className="playlist-page__tracks-heading"><h2 id="playlist-tracks">Utwory</h2><span>{model.total}</span></div>
        <TrackTable
          currentSongId={getSongId(currentSong)}
          emptyMessage="Ta playlista jest jeszcze pusta. Dodaj do niej utwory z katalogu."
          onPlay={playTrack}
          tracks={model.tracks}
        />
      </section>
    </div>
  )
}
