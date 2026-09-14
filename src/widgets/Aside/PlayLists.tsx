import { SUPABASE_STORAGE_URL } from '../../config.ts'
import type { EntityId, Playlist } from '../../shared/types/domain.ts'

const playlistImageBaseUrl = `${SUPABASE_STORAGE_URL}/images/songPictures`

interface PlaylistImage {
  image: string
  songId: EntityId | null
}

function getPlaylistImages(playlist: Playlist): PlaylistImage[] {
  const songIds = Array.isArray(playlist.song_ids) ? playlist.song_ids : []
  const songImages = Array.isArray(playlist.song_images) ? playlist.song_images : []

  return songIds
    .map((songId, index) => ({ image: songImages[index], songId }))
    .filter((item): item is PlaylistImage => item.songId !== 'NULL' && typeof item.image === 'string' && item.image.length > 0)
    .slice(0, 4)
}

interface PlayListsProps {
  playlist: Playlist
  choosePlaylist: (playlistId: EntityId) => void
}

export default function PlayLists({ playlist, choosePlaylist }: PlayListsProps) {
  const images = getPlaylistImages(playlist)
  const isMosaic = images.length > 1

  return (
    <button
      aria-label={`Otwórz playlistę ${playlist.playlist_name}`}
      className="playlists-container"
      disabled={playlist.playlist_id == null}
      onClick={() => { if (playlist.playlist_id != null) choosePlaylist(playlist.playlist_id) }}
      title={playlist.playlist_name ?? undefined}
      type="button"
    >
      <div className={`img-container${isMosaic ? ' img-container--mosaic' : ''}`}>
        {images.map(({ image, songId }, index) => (
          <img
            alt=""
            className="playlist__image"
            key={`${songId}-${image}-${index}`}
            src={`${playlistImageBaseUrl}/${image}`}
          />
        ))}
      </div>
      <div className="playlist-paragraph-container">
        <span className="playlist__paragraph">{playlist.playlist_name}</span>
      </div>
    </button>
  )
}
