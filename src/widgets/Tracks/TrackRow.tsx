import { getArtworkUrl, getSongId } from '../../modules/Catalog/song.ts'
import Icon from '../../shared/ui/Icon.tsx'
import type { EntityId, Song } from '../../shared/types/domain.ts'

interface TrackRowProps {
  index: number
  isCurrent: boolean
  onPlay: (songId: EntityId) => void
  track: Song
}

export default function TrackRow({ index, isCurrent, onPlay, track }: TrackRowProps) {
  const artwork = getArtworkUrl(track)
  const songId = getSongId(track)
  const title = track.song_name ?? 'Bez tytułu'

  return (
    <tr className={isCurrent ? 'track-row track-row--current' : 'track-row'}>
      <td className="track-row__index">{index + 1}</td>
      <td>
        <button className="track-row__identity" disabled={songId === null} onClick={() => { if (songId !== null) onPlay(songId) }} type="button">
          <span className="track-row__artwork">
            {artwork ? <img alt="" src={artwork} /> : <span>{title.slice(0, 1)}</span>}
            <span className="track-row__play"><Icon name="play" size={14} /></span>
          </span>
          <span>
            <strong>{title}</strong>
            <small>{track.author}</small>
          </span>
        </button>
      </td>
      <td className="track-row__album">{track.album_name || '—'}</td>
      <td className="track-row__actions">
        <button aria-label={`Odtwórz ${title}`} className="icon-button" disabled={songId === null} onClick={() => { if (songId !== null) onPlay(songId) }} type="button"><Icon name="play" size={16} /></button>
      </td>
    </tr>
  )
}
