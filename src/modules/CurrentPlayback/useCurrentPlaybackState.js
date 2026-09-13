import { useState } from 'react'

export function useCurrentPlaybackState() {
  const [currentSong, setCurrentSong] = useState(null)
  const [playbackQueue, setPlaybackQueue] = useState([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null)

  return {
    currentSong,
    currentTrackIndex,
    playbackQueue,
    setCurrentSong,
    setCurrentTrackIndex,
    setPlaybackQueue,
  }
}
