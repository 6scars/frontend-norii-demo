import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.js'
import Icon from '../../shared/ui/Icon.jsx'

export default function TrackRow({ index, isCurrent, onPlay, track }) {
  const artwork = getArtworkUrl(track)
  const songId = getSongId(track)

  return (
    <tr className={isCurrent ? 'track-row track-row--current' : 'track-row'}>
      <td className="track-row__index">{index + 1}</td>
      <td>
        <button className="track-row__identity" onClick={() => onPlay(songId)} type="button">
          <span className="track-row__artwork">
            {artwork ? <img alt="" src={artwork} /> : <span>{track.song_name.slice(0, 1)}</span>}
            <span className="track-row__play"><Icon name="play" size={14} /></span>
          </span>
          <span>
            <strong>{track.song_name}</strong>
            <small>{track.author}</small>
          </span>
        </button>
      </td>
      <td className="track-row__album">{track.album_name || '—'}</td>
      <td className="track-row__actions">
        <button aria-label={`Odtwórz ${track.song_name}`} className="icon-button" onClick={() => onPlay(songId)} type="button"><Icon name="play" size={16} /></button>
      </td>
    </tr>
  )
}
