import { Link } from 'react-router-dom'

import { getArtistRoute } from '../../app/routes.js'
import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.js'
import { useDiscovery } from '../../modules/Discovery/useDiscovery.js'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.js'
import FilterTabs from '../../shared/ui/FilterTabs/FilterTabs.jsx'
import Icon from '../../shared/ui/Icon.jsx'
import SearchField from '../../shared/ui/SearchField/SearchField.jsx'
import TrackTable from '../../widgets/Tracks/TrackTable.jsx'
import './DiscoverPage.css'

const sections = [
  { value: 'recommended', label: 'Dla Ciebie' },
  { value: 'tracks', label: 'Utwory' },
  { value: 'artists', label: 'Wykonawcy' },
]

export default function DiscoverPage() {
  const { songs } = useAuthContext()
  const { currentSong, setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const { chooseSong } = usePlayerContext()
  const { model, query, section, setQuery, setSection } = useDiscovery(songs)
  const featuredArtwork = getArtworkUrl(model.featured)

  const playTrack = (songId) => {
    const index = model.tracks.findIndex((song) => getSongId(song) === songId)
    if (index < 0) return
    setPlaybackQueue(model.tracks)
    setCurrentTrackIndex(index)
    chooseSong(songId)
  }

  const artistCards = (
    <div className="discover-artists">
      {model.artists.map((artist) => (
        <div className="discover-artist" key={artist.name.toLocaleLowerCase('pl')}>
          <Link to={getArtistRoute(artist.name)}><span className="discover-artist__avatar">{artist.name.slice(0, 1)}</span><span><strong>{artist.name}</strong><small>Wykonawca w Twoim katalogu</small></span></Link>
          <button aria-label={`Odtwórz utwory: ${artist.name}`} className="icon-button" onClick={() => playTrack(getSongId(artist.song))} type="button"><Icon name="play" size={15} /></button>
        </div>
      ))}
    </div>
  )

  return (
    <div className="discover-page">
      <header className="discover-heading"><h1>Odkrywaj</h1><p>Znajdź swoje następne brzmienie.</p></header>
      <SearchField label="Szukaj utworów, wykonawców i albumów" onChange={setQuery} value={query} />
      <FilterTabs label="Zakres odkrywania" onChange={setSection} options={sections} value={section} />

      {query ? (
        <section className="discover-section" aria-labelledby="discover-results"><h2 id="discover-results">Wyniki wyszukiwania</h2><TrackTable currentSongId={getSongId(currentSong)} emptyMessage={`Brak wyników dla „${query}”.`} onPlay={playTrack} tracks={model.tracks} /></section>
      ) : null}

      {!query && section === 'recommended' ? (
        <>
          <section className="discover-hero" aria-labelledby="discover-featured">
            {featuredArtwork ? <img alt="" src={featuredArtwork} /> : null}
            <div><span>WYBÓR Z KATALOGU</span><h2 id="discover-featured">Po drugiej stronie dźwięku</h2><p>{model.featured ? `${model.featured.song_name} — ${model.featured.author}` : 'Katalog jest obecnie pusty.'}</p><button className="button button--primary" disabled={!model.featured} onClick={() => playTrack(getSongId(model.featured))} type="button">Odkryj <Icon name="chevronRight" size={16} /></button></div>
          </section>
          <section className="discover-section" aria-labelledby="discover-catalog"><h2 id="discover-catalog">Brzmienia z katalogu</h2><div className="discover-cards">{model.tracks.slice(0, 4).map((song) => <button className="discover-card" key={getSongId(song)} onClick={() => playTrack(getSongId(song))} type="button"><span className="discover-card__art">{getArtworkUrl(song) ? <img alt="" src={getArtworkUrl(song)} /> : song.song_name.slice(0, 1)}</span><strong>{song.song_name}</strong><small>{song.author}</small></button>)}</div></section>
          <section className="discover-section" aria-labelledby="discover-artists"><h2 id="discover-artists">Nowe głosy</h2>{artistCards}</section>
        </>
      ) : null}

      {!query && section === 'tracks' ? <section className="discover-section" aria-labelledby="all-tracks"><h2 id="all-tracks">Wszystkie utwory</h2><TrackTable currentSongId={getSongId(currentSong)} emptyMessage="Katalog utworów jest pusty." onPlay={playTrack} tracks={model.tracks} /></section> : null}
      {!query && section === 'artists' ? <section className="discover-section" aria-labelledby="all-artists"><h2 id="all-artists">Wykonawcy</h2>{model.artists.length ? artistCards : <div className="track-table__empty" role="status">Brak wykonawców w katalogu.</div>}</section> : null}
    </div>
  )
}
