import { useCallback, useEffect, useRef } from 'react'

import { isCompactLayout } from '../../shared/hooks/useCompactLayout.ts'
import type { EntityId, Song } from '../../shared/types/domain.ts'
import { readSession } from '../Auth/session-storage.ts'
import { fetchSong, recordSongView } from '../Catalog/catalog-api.ts'
import { useCurrentPlaybackContext } from '../CurrentPlayback/useCurrentPlaybackContext.ts'
import { useRecentlyPlayedContext } from '../RecentlyPlayed/useRecentlyPlayedContext.ts'
import { useUIStateContext } from '../UIState/useUIStateContext.ts'
import { getAdjacentTrack } from './player-navigation.ts'
import type { PlaybackDirection } from './player-navigation.ts'
import { useAudioController } from './useAudioController.ts'
import type { AudioController } from './useAudioController.ts'

interface ChooseSongOptions {
  revealDetails?: boolean
}

export interface PlayerContextValue extends AudioController {
  chooseSong: (songId: EntityId, options?: ChooseSongOptions) => Promise<Song | null>
  goToNext: () => Promise<null>
  goToPrevious: () => Promise<null>
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

export function usePlayer(): PlayerContextValue {
  const selectionRequest = useRef<AbortController | null>(null)
  const {
    currentTrackIndex,
    playbackQueue,
    setCurrentSong,
    setCurrentTrackIndex,
  } = useCurrentPlaybackContext()
  const { recordRecentlyPlayed } = useRecentlyPlayedContext()
  const { openTrackDetails } = useUIStateContext()

  const chooseSong = useCallback(
    async (
      songId: EntityId,
      { revealDetails = true }: ChooseSongOptions = {},
    ): Promise<Song | null> => {
      selectionRequest.current?.abort()
      const controller = new AbortController()
      selectionRequest.current = controller

      try {
        const selectedSong = await fetchSong(songId, controller.signal)
        if (controller.signal.aborted || !selectedSong) return null

        await recordSongView(songId, readSession().token).catch((error: unknown) => {
          console.error('Recording song view failed', error)
        })
        if (controller.signal.aborted) return null

        if (revealDetails && !isCompactLayout()) openTrackDetails()
        recordRecentlyPlayed(selectedSong)
        setCurrentSong(selectedSong)
        return selectedSong
      } catch (error: unknown) {
        if (isAbortError(error)) return null
        const message = `chooseSong function ${String(error)}`
        reportPlayerError(message)
        throw new Error(message)
      }
    },
    [openTrackDetails, recordRecentlyPlayed, setCurrentSong],
  )

  const navigate = useCallback(
    async (direction: PlaybackDirection): Promise<null> => {
      const target = getAdjacentTrack(
        playbackQueue,
        currentTrackIndex,
        direction,
      )
      if (!target) {
        reportPlayerError('playback queue is empty')
        return null
      }

      setCurrentTrackIndex(target.index)
      await chooseSong(target.songId, { revealDetails: false })
      return null
    },
    [chooseSong, currentTrackIndex, playbackQueue, setCurrentTrackIndex],
  )

  const goToNext = useCallback(() => navigate('next'), [navigate])
  const goToPrevious = useCallback(() => navigate('previous'), [navigate])
  const audio = useAudioController({ onEnded: goToNext })

  useEffect(
    () => () => selectionRequest.current?.abort(),
    [],
  )

  return {
    ...audio,
    chooseSong,
    goToNext,
    goToPrevious,
  }
}

function reportPlayerError(details: string): void {
  console.error('App Error', details)
}
