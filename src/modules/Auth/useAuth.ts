import { useCallback, useEffect, useState } from 'react'

import { ApiError } from '../../shared/api/request.ts'
import type {
  EntityId,
  Playlist,
  Song,
} from '../../shared/types/domain.ts'
import { fetchSongs } from '../Catalog/catalog-api.ts'
import { fetchUserPlaylists } from '../Playlists/playlists-api.ts'
import { validateSession } from './auth-api.ts'
import { clearSession, readSession } from './session-storage.ts'

export interface AuthContextValue {
  initializeSession: () => Promise<boolean>
  isAuthenticated: boolean
  playlists: Playlist[]
  refreshPlaylists: (userId?: EntityId | null) => Promise<Playlist[]>
  songs: Song[]
}

export function useAuth(): AuthContextValue {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [songs, setSongs] = useState<Song[]>([])

  const refreshPlaylists = useCallback(
    async (userId: EntityId | null = readSession().userId): Promise<Playlist[]> => {
      if (userId == null || userId === '') {
        setPlaylists([])
        return []
      }

      const nextPlaylists = await fetchUserPlaylists(Number(userId))
      setPlaylists(nextPlaylists)
      return nextPlaylists
    },
    [],
  )

  const initializeSession = useCallback(async (): Promise<boolean> => {
    const { token, userId } = readSession()

    try {
      const isValid = await validateSession(token)
      setIsAuthenticated(isValid)

      if (!isValid) {
        clearSession()
        setPlaylists([])
        return false
      }

      await refreshPlaylists(userId)
      return true
    } catch (error: unknown) {
      if (
        error instanceof ApiError
        && (error.status === 401 || error.status === 403)
      ) {
        clearSession()
      }
      setIsAuthenticated(false)
      setPlaylists([])
      return false
    }
  }, [refreshPlaylists])

  useEffect(() => {
    void fetchSongs()
      .then((fetchedSongs) => setSongs(fetchedSongs))
      .catch(() => setSongs([]))
  }, [])

  useEffect(() => {
    void initializeSession()
  }, [initializeSession])

  return {
    initializeSession,
    isAuthenticated,
    playlists,
    refreshPlaylists,
    songs,
  }
}
