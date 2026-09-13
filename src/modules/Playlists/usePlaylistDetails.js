import { useEffect, useMemo, useState } from 'react'

import { getSongId } from '../Catalog/song.js'
import { useCurrentPlaybackContext } from '../CurrentPlayback/useCurrentPlaybackContext.js'
import { usePlayerContext } from '../Player/usePlayerContext.js'
import { fetchPlaylistDetails } from './playlists-api.js'
import { buildPlaylistPageModel } from './playlist-page-model.js'

export function usePlaylistDetails(playlistId) {
  const [playlistData, setPlaylistData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentSong, setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const { chooseSong } = usePlayerContext()
  const model = useMemo(() => buildPlaylistPageModel(playlistData), [playlistData])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPlaylist() {
      setIsLoading(true)
      setError(null)
      setPlaylistData([])
      try {
        const playlist = await fetchPlaylistDetails(playlistId, controller.signal)
        if (!controller.signal.aborted) setPlaylistData(playlist)
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError.message || 'Nie udało się pobrać playlisty')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadPlaylist()
    return () => controller.abort()
  }, [playlistId])

  const playTrack = async (songId) => {
    const index = model.tracks.findIndex((track) => String(getSongId(track)) === String(songId))
    if (index < 0) return
    setPlaybackQueue(model.tracks)
    setCurrentTrackIndex(index)
    await chooseSong(getSongId(model.tracks[index]))
  }

  return {
    currentSong,
    error,
    isLoading,
    model,
    playAll: () => model.tracks[0] && playTrack(getSongId(model.tracks[0])),
    playTrack,
  }
}
