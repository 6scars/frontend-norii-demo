import { useState } from 'react'

import { readSession } from '../../../modules/Auth/session-storage.js'
import { useAuthContext } from '../../../modules/Auth/useAuthContext.js'
import { getSongId } from '../../../modules/Catalog/song.js'
import { getValidPlaylists } from '../../../modules/Playlists/playlist-collection.js'
import { updatePlaylistTrack } from '../../../modules/Playlists/playlists-api.js'
import Icon from '../../../shared/ui/Icon.jsx'
import Playlist from './Playlist.jsx'
import './AddSong.css'

export default function AddTrackToPlaylist({ currentSong, isOpen }) {
  const { playlists, refreshPlaylists } = useAuthContext()
  const [error, setError] = useState(null)
  const [pendingPlaylistId, setPendingPlaylistId] = useState(null)
  const validPlaylists = getValidPlaylists(playlists)

  if (!isOpen) return null

  const togglePlaylist = async (playlist, isIncluded) => {
    setError(null)
    setPendingPlaylistId(playlist.playlist_id)

    try {
      await updatePlaylistTrack({
        isIncluded,
        playlistId: playlist.playlist_id,
        trackId: getSongId(currentSong),
      }, readSession().token)
      await refreshPlaylists()
    } catch (requestError) {
      setError(requestError.message || 'Nie udało się połączyć z serwerem')
    } finally {
      setPendingPlaylistId(null)
    }
  }

  return (
    <section aria-label="Dodaj utwór do playlisty" className="show-add-song-container">
      <header><span className="show-add-song-container__icon"><Icon name="plus" size={16} /></span><div><strong>Dodaj do playlisty</strong><small>{currentSong.song_name}</small></div></header>
      <div className="show-add-song-container__list red-scroll-bar">
        {validPlaylists.length ? validPlaylists.map((playlist) => (
          <Playlist
            currentSong={currentSong}
            isPending={pendingPlaylistId === playlist.playlist_id}
            key={playlist.playlist_id}
            onToggle={togglePlaylist}
            playlist={playlist}
          />
        )) : <p className="show-add-song-container__empty">Nie masz jeszcze żadnej playlisty.</p>}
      </div>
      {error ? <p className="show-add-song-container__error" role="alert">{error}</p> : null}
    </section>
  )
}
