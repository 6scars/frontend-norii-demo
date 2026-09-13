import { SUPABASE_STORAGE_URL } from '../../config.js'

const playlistImageBaseUrl = `${SUPABASE_STORAGE_URL}/images/songPictures`

function getPlaylistImages(playlist) {
  const songIds = Array.isArray(playlist.song_ids) ? playlist.song_ids : []
  const songImages = Array.isArray(playlist.song_images) ? playlist.song_images : []

  return songIds
    .map((songId, index) => ({ image: songImages[index], songId }))
    .filter(({ image, songId }) => songId !== 'NULL' && image)
    .slice(0, 4)
}

export default function PlayLists({ playlist, choosePlaylist }) {
  const images = getPlaylistImages(playlist)
  const isMosaic = images.length > 1

  return (
    <button
      aria-label={`Otwórz playlistę ${playlist.playlist_name}`}
      className="playlists-container"
      onClick={() => choosePlaylist(playlist.playlist_id)}
      title={playlist.playlist_name}
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
