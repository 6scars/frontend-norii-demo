import { useAuthContext } from '../Auth/useAuthContext.ts'
import { getSongId } from '../Catalog/song.ts'
import { useCurrentPlaybackContext } from '../CurrentPlayback/useCurrentPlaybackContext.ts'
import { buildPlaybackQueue } from './playback-queue.ts'
import { usePlayerContext } from './usePlayerContext.ts'

export function usePlaybackQueue() {
  const { songs } = useAuthContext()
  const {
    currentSong,
    playbackQueue,
    setCurrentTrackIndex,
    setPlaybackQueue,
  } = useCurrentPlaybackContext()
  const { chooseSong, isPlaying } = usePlayerContext()
  const { queue, suggestions } = buildPlaybackQueue(playbackQueue, songs)

  const playFromQueue = (index: number, fromSuggestions = false): void => {
    const tracks = fromSuggestions ? suggestions : queue
    const id = getSongId(tracks[index])
    if (id === null) return
    setPlaybackQueue(tracks)
    setCurrentTrackIndex(index)
    void chooseSong(id)
  }

  const clearQueue = (): void => {
    setPlaybackQueue([])
    setCurrentTrackIndex(null)
  }

  return {
    queue,
    suggestions,
    currentSong,
    isPlaying,
    playFromQueue,
    clearQueue,
  }
}
