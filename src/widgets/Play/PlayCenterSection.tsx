import { useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'

import { SUPABASE_STORAGE_URL } from '../../config.ts'
import { formatPlayerTime } from '../../modules/Player/player-display.ts'
import Icon from '../../shared/ui/Icon.tsx'
import type { Song } from '../../shared/types/domain.ts'
import type { AudioController } from '../../modules/Player/useAudioController.ts'
import './PlayCenterSection.css'

const songsStorageUrl = `${SUPABASE_STORAGE_URL}/songs`

interface PlayCenterSectionProps {
  audioEvents: AudioController['audioEvents']
  audioRef: AudioController['audioRef']
  handlePlay: () => void
  play: boolean
  duration: number
  current: number
  progressBar: number
  loop: boolean
  handleLoop: () => void
  currentSong: Song
  goToNextSong: () => unknown
  goToPreviousSong: () => unknown
  setCurrentTime: AudioController['setCurrentTime']
}

export default function PlayCenterSection({
  audioEvents,
  audioRef,
  handlePlay,
  play,
  duration,
  current,
  progressBar,
  loop,
  handleLoop,
  currentSong,
  goToNextSong,
  goToPreviousSong,
  setCurrentTime,
}: PlayCenterSectionProps) {
  const hasSong = Boolean(currentSong?.file)
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0
  const [isProgressEngaged, setProgressEngaged] = useState(false)

  const beginProgressInteraction = () => setProgressEngaged(true)
  const endProgressInteraction = () => setProgressEngaged(false)

  const onSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.currentTarget.value)
    setCurrentTime(nextTime)
  }

  return (
    <div className="play-center-section">
      <div aria-label="Sterowanie odtwarzaniem" className="player-controls" role="group">
        <button
          aria-label="Poprzedni utw\u00f3r"
          className="player-control"
          disabled={!hasSong}
          onClick={goToPreviousSong}
          type="button"
        >
          <Icon name="previous" size={20} />
        </button>
        <button
          aria-label={play ? 'Wstrzymaj' : 'Odtw\u00f3rz'}
          className="player-control player-control--primary"
          disabled={!hasSong}
          onClick={handlePlay}
          type="button"
        >
          <Icon name={play ? 'pause' : 'play'} size={24} />
        </button>
        <button
          aria-label="Nast\u0119pny utw\u00f3r"
          className="player-control"
          disabled={!hasSong}
          onClick={goToNextSong}
          type="button"
        >
          <Icon name="next" size={20} />
        </button>
        <button
          aria-label={loop ? 'Wy\u0142\u0105cz zap\u0119tlenie' : 'W\u0142\u0105cz zap\u0119tlenie'}
          aria-pressed={loop}
          className="player-control player-control--repeat"
          disabled={!hasSong}
          onClick={handleLoop}
          type="button"
        >
          <Icon name="repeat" size={19} />
        </button>
      </div>

      <div className="player-progress">
        <span className="player-progress__time">{formatPlayerTime(current)}</span>
        <input
          aria-label="Pozycja utworu"
          className={`player-progress__input${isProgressEngaged ? ' player-progress__input--engaged' : ''}`}
          disabled={!hasSong || safeDuration === 0}
          max={safeDuration}
          min="0"
          onChange={onSeek}
          onBlur={() => setProgressEngaged(false)}
          onFocus={() => setProgressEngaged(true)}
          onLostPointerCapture={endProgressInteraction}
          onPointerCancel={endProgressInteraction}
          onPointerDown={beginProgressInteraction}
          onPointerUp={endProgressInteraction}
          step="0.1"
          style={{ '--player-progress': String(progressBar) + '%' } as CSSProperties}
          type="range"
          value={Math.min(Math.max(current || 0, 0), safeDuration)}
        />
        <span className="player-progress__time">{formatPlayerTime(duration)}</span>
      </div>

      <audio
        {...audioEvents}
        ref={audioRef}
        src={hasSong ? songsStorageUrl + '/' + currentSong.file : undefined}
        preload="metadata"
      />
    </div>
  )
}
