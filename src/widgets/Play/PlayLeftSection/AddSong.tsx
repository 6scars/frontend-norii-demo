import { useState } from 'react'

import { readSession } from '../../../modules/Auth/session-storage.ts'
import { useAuthContext } from '../../../modules/Auth/useAuthContext.ts'
import { getSongId } from '../../../modules/Catalog/song.ts'
import { getValidPlaylists } from '../../../modules/Playlists/playlist-collection.ts'
import { updatePlaylistTrack } from '../../../modules/Playlists/playlists-api.ts'
import Icon from '../../../shared/ui/Icon.tsx'
import Playlist from './Playlist.tsx'
import { getErrorMessage } from '../../../shared/errors/get-error-message.ts'
import type { EntityId, Song } from '../../../shared/types/domain.ts'
import type { ValidPlaylist } from '../../../modules/Playlists/playlist-collection.ts'
import './AddSong.css'

interface AddTrackToPlaylistProps {
  currentSong: Song
  isOpen: boolean
}

export default function AddTrackToPlaylist({ currentSong, isOpen }: AddTrackToPlaylistProps) {
  const { playlists, refreshPlaylists } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [pendingPlaylistId, setPendingPlaylistId] = useState<EntityId | null>(null)
  const validPlaylists = getValidPlaylists(playlists)

  if (!isOpen) return null

  const togglePlaylist = async (playlist: ValidPlaylist, isIncluded: boolean) => {
    const trackId = getSongId(currentSong)
    if (trackId === null) {
      setError('Nie można rozpoznać wybranego utworu')
      return
    }
    setError(null)
    setPendingPlaylistId(playlist.playlist_id)

    try {
      await updatePlaylistTrack({
        isIncluded,
        playlistId: playlist.playlist_id,
        trackId,
      }, readSession().token)
      await refreshPlaylists()
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Nie udało się połączyć z serwerem'))
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
            onToggle={(playlist, isIncluded) => { void togglePlaylist(playlist, isIncluded) }}
            playlist={playlist}
          />
        )) : <p className="show-add-song-container__empty">Nie masz jeszcze żadnej playlisty.</p>}
      </div>
      {error ? <p className="show-add-song-container__error" role="alert">{error}</p> : null}
    </section>
  )
}
