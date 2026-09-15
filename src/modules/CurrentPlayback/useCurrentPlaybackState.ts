import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { Song } from '../../shared/types/domain.ts'

export interface CurrentPlaybackContextValue {
  currentSong: Song | null
  currentTrackIndex: number | null
  playbackQueue: Song[]
  setCurrentSong: Dispatch<SetStateAction<Song | null>>
  setCurrentTrackIndex: Dispatch<SetStateAction<number | null>>
  setPlaybackQueue: Dispatch<SetStateAction<Song[]>>
}

export function useCurrentPlaybackState(): CurrentPlaybackContextValue {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [playbackQueue, setPlaybackQueue] = useState<Song[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null)

  return {
    currentSong,
    currentTrackIndex,
    playbackQueue,
    setCurrentSong,
    setCurrentTrackIndex,
    setPlaybackQueue,
  }
}
