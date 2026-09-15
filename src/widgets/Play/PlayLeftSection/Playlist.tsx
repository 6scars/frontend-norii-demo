import { playlistContainsSong } from '../../../modules/Playlists/playlist-collection.ts'
import Icon from '../../../shared/ui/Icon.tsx'
import type { Song } from '../../../shared/types/domain.ts'
import type { ValidPlaylist } from '../../../modules/Playlists/playlist-collection.ts'

interface PlaylistProps {
  currentSong: Song
  isPending: boolean
  onToggle: (playlist: ValidPlaylist, isIncluded: boolean) => void
  playlist: ValidPlaylist
}

export default function Playlist({ currentSong, isPending, onToggle, playlist }: PlaylistProps) {
  const isIncluded = playlistContainsSong(playlist, currentSong)

  return (
    <button
      aria-pressed={isIncluded}
      className={isIncluded ? 'add-song-playlist add-song-playlist--included' : 'add-song-playlist'}
      disabled={isPending}
      onClick={() => onToggle(playlist, isIncluded)}
      type="button"
    >
      <span><strong>{playlist.playlist_name}</strong><small>{isIncluded ? 'Utwór jest na tej playliście' : 'Dodaj do playlisty'}</small></span>
      <span className="add-song-playlist__status">{isPending ? '…' : <Icon name={isIncluded ? 'heart' : 'plus'} size={16} />}</span>
    </button>
  )
}
