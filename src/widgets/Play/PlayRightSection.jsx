import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import Icon from '../../shared/ui/Icon.jsx'
import './PlayRightSection.css'

export default function PlayRightSection({ volume, handleVolume, muted, handleMute }) {
  const audibleVolume = muted ? 0 : volume

  return (
    <div className="play-right-section">
      <div className="volume-container">
        <button
          aria-label={muted ? 'W\u0142\u0105cz d\u017awi\u0119k' : 'Wycisz'}
          aria-pressed={muted}
          className="player-utility-button"
          onClick={handleMute}
          type="button"
        >
          <Icon name={muted ? 'volumeMuted' : 'volume'} size={20} />
        </button>
        <input
          aria-label="G\u0142o\u015bno\u015b\u0107"
          className="volume-slider"
          max="1"
          min="0"
          onChange={(event) => handleVolume(Number(event.currentTarget.value))}
          step="0.01"
          style={{ '--volume-progress': String(audibleVolume * 100) + '%' }}
          type="range"
          value={audibleVolume}
        />
        <Link aria-label="Otw\u00f3rz pe\u0142ny odtwarzacz" className="player-utility-button" to={APP_ROUTES.nowPlaying}>
          <Icon name="expand" size={19} />
        </Link>
      </div>
    </div>
  )
}
