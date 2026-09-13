import { useMemo, useState } from 'react'

import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.js'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.js'
import { buildRadioModel } from '../../modules/Radio/radio-model.js'
import Icon from '../../shared/ui/Icon.jsx'
import TrackTable from '../../widgets/Tracks/TrackTable.jsx'
import './RadioPage.css'

export default function RadioPage() {
  const { songs } = useAuthContext()
  const { currentSong, setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const { chooseSong } = usePlayerContext()
  const [selectedStationId, setSelectedStationId] = useState('catalog')
  const model = useMemo(() => buildRadioModel(songs), [songs])
  const selectedStation = model.stations.find((station) => station.id === selectedStationId) || model.stations[0]

  const playTrack = async (songId) => {
    if (!selectedStation) return
    const index = selectedStation.tracks.findIndex((song) => String(getSongId(song)) === String(songId))
    if (index < 0) return
    setPlaybackQueue(selectedStation.tracks)
    setCurrentTrackIndex(index)
    await chooseSong(getSongId(selectedStation.tracks[index]))
  }

  const startStation = () => {
    const firstSong = selectedStation?.tracks[0]
    if (firstSong) playTrack(getSongId(firstSong))
  }

  if (!model.stations.length) {
    return (
      <section className="radio-page radio-page--empty" role="status">
        <Icon name="radio" size={40} />
        <h1>Radio czeka na muzykę</h1>
        <p>Gdy katalog otrzyma pierwsze utwory, pojawią się tutaj stacje oparte na realnych danych.</p>
      </section>
    )
  }

  return (
    <div className="radio-page">
      <header className="radio-heading"><span className="radio-heading__signal"><Icon name="radio" size={22} /></span><div><h1>Radio</h1><p>Nieprzerwane kolejki ułożone z Twojego katalogu.</p></div></header>
      <section aria-labelledby="radio-stations" className="radio-stations">
        <div className="radio-section-heading"><h2 id="radio-stations">Wybierz stację</h2><span>{model.total} utworów w katalogu</span></div>
        <div className="radio-stations__grid">
          {model.stations.map((station, index) => {
            const artwork = getArtworkUrl(station.tracks[0])
            const isActive = station.id === selectedStation?.id
            return (
              <button
                aria-pressed={isActive}
                className={isActive ? 'radio-station radio-station--active' : 'radio-station'}
                key={station.id}
                onClick={() => setSelectedStationId(station.id)}
                type="button"
              >
                {artwork ? <img alt="" className="radio-station__background" src={artwork} /> : null}
                <span className="radio-station__number">0{index + 1}</span>
                <span className="radio-station__wave"><i /><i /><i /><i /><i /></span>
                <strong>{station.title}</strong>
                <small>{station.description}</small>
              </button>
            )
          })}
        </div>
      </section>
      <section aria-labelledby="radio-queue" className="radio-queue">
        <div className="radio-queue__intro"><div><span>TERAZ WYBRANE</span><h2 id="radio-queue">{selectedStation.title}</h2><p>{selectedStation.description}</p></div><button className="button button--primary" onClick={startStation} type="button"><Icon name="play" size={16} /> Uruchom radio</button></div>
        <TrackTable currentSongId={getSongId(currentSong)} emptyMessage="Ta stacja nie ma jeszcze utworów." onPlay={playTrack} tracks={selectedStation.tracks} />
      </section>
    </div>
  )
}
