import { Link, useParams } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { buildArtistModel } from '../../modules/Artists/artist-model.js'
import { getArtistArtworkUrl, getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.js'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.js'
import Icon from '../../shared/ui/Icon.jsx'
import TrackTable from '../../widgets/Tracks/TrackTable.jsx'
import './ArtistPage.css'

export default function ArtistPage() {
  const { artistName } = useParams()
  const { songs } = useAuthContext()
  const { currentSong, setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const { chooseSong } = usePlayerContext()
  const model = buildArtistModel(songs, artistName)
  const portrait = getArtistArtworkUrl({ author_image: model.portrait }) || getArtworkUrl(model.tracks[0])

  const playTrack = async (songId) => {
    const index = model.tracks.findIndex((song) => String(getSongId(song)) === String(songId))
    if (index < 0) return
    setPlaybackQueue(model.tracks)
    setCurrentTrackIndex(index)
    await chooseSong(getSongId(model.tracks[index]))
  }

  if (!model.tracks.length) {
    return <section className="artist-page artist-page--empty" role="status"><Icon name="discover" size={38} /><h1>Nie znaleźliśmy tego twórcy</h1><p>Profil nie ma jeszcze żadnego utworu w aktualnym katalogu.</p><Link className="button button--quiet" to={APP_ROUTES.discover}>Wróć do odkrywania</Link></section>
  }

  return (
    <div className="artist-page">
      <Link className="artist-page__back" to={APP_ROUTES.discover}><Icon name="chevronLeft" size={17} /> Odkrywaj</Link>
      <header className="artist-hero">
        {portrait ? <img alt="" className="artist-hero__background" src={portrait} /> : null}
        <span className="artist-hero__portrait">{portrait ? <img alt={`Portret: ${model.name}`} src={portrait} /> : model.name.slice(0, 1)}</span>
        <div className="artist-hero__copy"><span className="artist-hero__eyebrow">TWÓRCA</span><h1>{model.name}</h1><p>{model.followers === null ? 'Liczba obserwujących niedostępna' : `${model.followers} obserwujących`} · {model.tracks.length} {model.tracks.length === 1 ? 'utwór' : 'utworów'}</p><div><button className="button button--primary" onClick={() => playTrack(getSongId(model.tracks[0]))} type="button"><Icon name="play" size={16} /> Odtwórz</button><button className="button button--quiet" disabled title="Backend nie udostępnia jeszcze obserwowania twórców" type="button">Obserwuj</button></div></div>
      </header>
      <section aria-labelledby="artist-about" className="artist-about"><div><span>O TWÓRCY</span><h2 id="artist-about">O artyście</h2></div><p>{model.biography || 'Twórca nie dodał jeszcze biografii.'}</p></section>
      <section aria-labelledby="artist-tracks" className="artist-tracks"><div className="artist-tracks__heading"><h2 id="artist-tracks">Utwory</h2><span>{model.tracks.length}</span></div><TrackTable currentSongId={getSongId(currentSong)} emptyMessage="Brak utworów tego twórcy." onPlay={playTrack} tracks={model.tracks} /></section>
    </div>
  )
}
