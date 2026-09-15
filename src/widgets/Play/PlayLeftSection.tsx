import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getArtistRoute } from '../../app/routes.ts'
import { getArtworkUrl } from '../../modules/Catalog/song.ts'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import Icon from '../../shared/ui/Icon.tsx'
import AddTrackToPlaylist from './PlayLeftSection/AddSong.tsx'
import type { Song } from '../../shared/types/domain.ts'
import './PlayLeftSection.css'

export default function PlayLeftSection({ currentSong }: { currentSong: Song }) {
  const [isPlaylistPickerOpen, setPlaylistPickerOpen] = useState(false)
  const { closeTrackDetails, isTrackDetailsOpen, openTrackDetails } = useUIStateContext()
  const artwork = getArtworkUrl(currentSong)

  const openDetails = () => {
    setPlaylistPickerOpen(false)
    openTrackDetails()
  }

  return (
    <div className="play-left-section">
      <button
        aria-controls="song-description"
        aria-expanded={isTrackDetailsOpen}
        aria-label={`O utworze: ${currentSong.song_name}`}
        className="song-image-container"
        onClick={openDetails}
        type="button"
      >
        {artwork ? <img alt="" src={artwork} /> : <Icon name="play" size={24} />}
      </button>
      <div className="title-authors">
        <button aria-controls="song-description" aria-expanded={isTrackDetailsOpen} className="title" onClick={openDetails} type="button">
          {currentSong.song_name}
        </button>
        <Link className="authors" onClick={closeTrackDetails} to={getArtistRoute(currentSong.author ?? '')}>
          {currentSong.author}
        </Link>
      </div>
      <div className="play-left-section__playlist">
        <button aria-expanded={isPlaylistPickerOpen} aria-label="Dodaj utwór do playlisty" className="play-left-section__add icon-button" onClick={() => setPlaylistPickerOpen((isOpen) => !isOpen)} type="button">
          <Icon name="plus" size={17} />
        </button>
        <AddTrackToPlaylist currentSong={currentSong} isOpen={isPlaylistPickerOpen} />
      </div>
    </div>
  )
}
