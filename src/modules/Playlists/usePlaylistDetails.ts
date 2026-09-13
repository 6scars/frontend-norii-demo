import { useEffect, useMemo, useState } from 'react'

import type { EntityId, Song } from '../../shared/types/domain.ts'
import { getSongId } from '../Catalog/song.ts'
import { useCurrentPlaybackContext } from '../CurrentPlayback/useCurrentPlaybackContext.ts'
import { usePlayerContext } from '../Player/usePlayerContext.ts'
import { buildPlaylistPageModel } from './playlist-page-model.ts'
import { fetchPlaylistDetails } from './playlists-api.ts'

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : 'Nie udało się pobrać playlisty'
}

export function usePlaylistDetails(playlistId: EntityId) {
  const [playlistData, setPlaylistData] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {
    currentSong,
    setCurrentTrackIndex,
    setPlaybackQueue,
  } = useCurrentPlaybackContext()
  const { chooseSong } = usePlayerContext()
  const model = useMemo(
    () => buildPlaylistPageModel(playlistData),
    [playlistData],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function loadPlaylist(): Promise<void> {
      setIsLoading(true)
      setError(null)
      setPlaylistData([])
      try {
        const playlist = await fetchPlaylistDetails(
          playlistId,
          controller.signal,
        )
        if (!controller.signal.aborted) setPlaylistData(playlist)
      } catch (requestError: unknown) {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(requestError))
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadPlaylist()
    return () => controller.abort()
  }, [playlistId])

  const playTrack = async (songId: EntityId): Promise<void> => {
    const index = model.tracks.findIndex(
      (track) => String(getSongId(track)) === String(songId),
    )
    if (index < 0) return

    const selectedTrack = model.tracks[index]
    const selectedSongId = getSongId(selectedTrack)
    if (selectedSongId === null) return

    setPlaybackQueue(model.tracks)
    setCurrentTrackIndex(index)
    await chooseSong(selectedSongId)
  }

  const playAll = (): void => {
    const firstTrackId = getSongId(model.tracks[0])
    if (firstTrackId !== null) void playTrack(firstTrackId)
  }

  return {
    currentSong,
    error,
    isLoading,
    model,
    playAll,
    playTrack,
  }
}
