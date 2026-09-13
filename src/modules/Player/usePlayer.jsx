import { useCallback, useEffect, useRef } from 'react'

import { readSession } from '../Auth/session-storage.js'
import { fetchSong, recordSongView } from '../Catalog/catalog-api.js'
import { useCurrentPlaybackContext } from '../CurrentPlayback/useCurrentPlaybackContext.js'
import { useRecentlyPlayedContext } from '../RecentlyPlayed/useRecentlyPlayedContext.js'
import { useUIStateContext } from '../UIState/useUIStateContext.js'
import { isCompactLayout } from '../../shared/hooks/useCompactLayout.js'
import { getAdjacentTrack } from './player-navigation.js'
import { useAudioController } from './useAudioController.js'

export function usePlayer() {
  const selectionRequest = useRef(null)
  const { currentTrackIndex, playbackQueue, setCurrentSong, setCurrentTrackIndex } = useCurrentPlaybackContext()
  const { recordRecentlyPlayed } = useRecentlyPlayedContext()
  const { openTrackDetails } = useUIStateContext()

  const chooseSong = useCallback(async (songId, { revealDetails = true } = {}) => {
    selectionRequest.current?.abort()
    const controller = new AbortController()
    selectionRequest.current = controller

    try {
      const selectedSong = await fetchSong(songId, controller.signal)
      if (controller.signal.aborted || !selectedSong) return null

      await recordSongView(songId, readSession().token).catch((error) => {
        console.error('Recording song view failed', error)
      })
      if (controller.signal.aborted) return null

      if (revealDetails && !isCompactLayout()) openTrackDetails()
      recordRecentlyPlayed(selectedSong)
      setCurrentSong(selectedSong)
      return selectedSong
    } catch (error) {
      if (error?.name === 'AbortError') return null
      const message = `chooseSong function ${error}`
      reportPlayerError(message)
      throw new Error(message)
    }
  }, [openTrackDetails, recordRecentlyPlayed, setCurrentSong])

  const navigate = useCallback(async (direction) => {
    const target = getAdjacentTrack(playbackQueue, currentTrackIndex, direction)
    if (!target) {
      reportPlayerError('playback queue is empty')
      return null
    }

    setCurrentTrackIndex(target.index)
    await chooseSong(target.songId, { revealDetails: false })
    return null
  }, [chooseSong, currentTrackIndex, playbackQueue, setCurrentTrackIndex])

  const goToNext = useCallback(() => navigate('next'), [navigate])
  const goToPrevious = useCallback(() => navigate('previous'), [navigate])
  const audio = useAudioController({ onEnded: goToNext })

  useEffect(() => () => selectionRequest.current?.abort(), [])

  return {
    ...audio,
    chooseSong,
    goToNext,
    goToPrevious,
  }
}

function reportPlayerError(details) {
  console.error('App Error', details)
}
