import { useCallback, useEffect, useState } from 'react'

import { fetchSongs } from '../Catalog/catalog-api.js'
import { fetchUserPlaylists } from '../Playlists/playlists-api.js'
import { validateSession } from './auth-api.js'
import { clearSession, readSession } from './session-storage.js'

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [playlists, setPlaylists] = useState([])
    const [songs, setSongs] = useState([])

    const refreshPlaylists = useCallback(async (userId = readSession().userId) => {
        if (!userId) {
            setPlaylists([])
            return []
        }

        const nextPlaylists = await fetchUserPlaylists(Number(userId))
        setPlaylists(nextPlaylists)
        return nextPlaylists
    }, [])

    const initializeSession = useCallback(async () => {
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
        } catch (error) {
            if (error?.status === 401 || error?.status === 403) clearSession()
            setIsAuthenticated(false)
            setPlaylists([])
            return false
        }
    }, [refreshPlaylists])

    useEffect(() => {
        fetchSongs().then((fetchedSongs) => setSongs(fetchedSongs || [])).catch(() => setSongs([]))
    }, [])

    useEffect(() => {
        initializeSession()
    }, [initializeSession])

    return {
        initializeSession,
        isAuthenticated,
        playlists,
        refreshPlaylists,
        songs,
    }
}
