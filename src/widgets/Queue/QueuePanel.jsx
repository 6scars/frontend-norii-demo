import Icon from '../../shared/ui/Icon.jsx'
import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import { formatQueueCount } from '../../modules/Player/playback-queue.js'
import './QueuePanel.css'

function QueueSong({ song, active, onPlay }) {
  return (
    <button className={`queue-song ${active ? 'queue-song--active' : ''}`} onClick={onPlay}
      aria-label={`Odtwórz ${song.song_name} — ${song.author}`} aria-current={active ? 'true' : undefined} type="button">
      <span className="queue-song__cover">{getArtworkUrl(song) ? <img alt="" src={getArtworkUrl(song)} loading="lazy" /> : null}</span>
      <span><strong>{song.song_name}</strong><small>{song.author}</small></span>
      <Icon name="play" size={18} />
    </button>
  )
}

export default function QueuePanel({ playback, onClose }) {
  const { queue, suggestions, currentSong, isPlaying, playFromQueue, clearQueue } = playback

  return (
    <aside className="queue-panel" aria-label="Kolejka odtwarzania">
      <div className="queue-panel__title">
        <h2>Teraz gra</h2>
        <button
          aria-label="Zwiń kolejkę"
          className="queue-panel__close"
          onClick={onClose}
          type="button"
        >
          <Icon name="chevronRight" size={19} />
          Zwiń
        </button>
      </div>
      <div className="queue-panel__current">
        <span className="queue-panel__eyebrow">{currentSong ? (isPlaying ? 'Teraz odtwarzane' : 'Wstrzymano') : 'Twoja muzyka'}</span>
        {currentSong ? (
          <div className="queue-song queue-song--current">
            <div className="queue-song__cover">{getArtworkUrl(currentSong) ? <img alt="" src={getArtworkUrl(currentSong)} /> : null}</div>
            <span><strong>{currentSong.song_name}</strong><small>{currentSong.author}</small></span>
            <span className={`queue-equalizer ${isPlaying ? '' : 'queue-equalizer--paused'}`} aria-hidden="true"><i /><i /><i /></span>
          </div>
        ) : <p className="queue-panel__empty">Wybierz utwór, aby rozpocząć.</p>}
      </div>
      <div className="queue-panel__bar">
        <h3>Kolejka</h3>
        <button onClick={clearQueue} disabled={!queue.length} type="button">Wyczyść</button>
      </div>
      <div className="queue-panel__list">
        {queue.length ? queue.map((song, index) => (
          <QueueSong key={`${getSongId(song)}-${index}`} song={song}
            active={String(getSongId(song)) === String(getSongId(currentSong))}
            onPlay={() => playFromQueue(index)} />
        )) : (
          <div className="queue-panel__empty-state">
            <Icon name="queue" size={28} />
            <p>Kolejka jest pusta</p>
            <small>Włącz utwór lub playlistę, aby dodać muzykę do kolejki.</small>
          </div>
        )}
        {suggestions.length ? (
          <section className="queue-panel__suggestions" aria-label="Propozycje dla Ciebie">
            <h3>Propozycje dla Ciebie</h3>
            {suggestions.map((song, index) => (
              <QueueSong key={`${getSongId(song)}-${index}`} song={song} onPlay={() => playFromQueue(index, true)} />
            ))}
          </section>
        ) : null}
      </div>
      <p className="queue-panel__duration" role="status">{formatQueueCount(queue.length)}</p>
    </aside>
  )
}
