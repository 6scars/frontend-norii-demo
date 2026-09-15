import { getSongId } from '../../modules/Catalog/song.ts'
import TrackRow from './TrackRow.tsx'
import type { EntityId, Song } from '../../shared/types/domain.ts'
import './TrackTable.css'

interface TrackTableProps {
  currentSongId: EntityId | null
  emptyMessage: string
  onPlay: (songId: EntityId) => void
  tracks: readonly Song[]
}

export default function TrackTable({ currentSongId, emptyMessage, onPlay, tracks }: TrackTableProps) {
  if (!tracks.length) return <div className="track-table__empty" role="status">{emptyMessage}</div>

  return (
    <div className="track-table__scroll">
      <table className="track-table">
        <thead><tr><th scope="col">#</th><th scope="col">Utwór</th><th scope="col">Album</th><th scope="col"><span className="sr-only">Akcje</span></th></tr></thead>
        <tbody>
          {tracks.map((track, index) => (
            <TrackRow
              index={index}
              isCurrent={getSongId(track) === currentSongId}
              key={`${getSongId(track)}-${index}`}
              onPlay={onPlay}
              track={track}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
