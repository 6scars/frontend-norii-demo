import { useCallback, useState } from 'react'

import {
  addRecentlyPlayed,
  readRecentlyPlayed,
  RECENTLY_PLAYED_LIMIT,
  saveRecentlyPlayed,
} from './recently-played.js'

export function useRecentlyPlayed(limit = RECENTLY_PLAYED_LIMIT) {
  const [recentlyPlayed, setRecentlyPlayed] = useState(readRecentlyPlayed)

  const recordRecentlyPlayed = useCallback((song) => {
    setRecentlyPlayed((currentSongs) => {
      const nextSongs = addRecentlyPlayed(currentSongs, song, limit)
      saveRecentlyPlayed(nextSongs)
      return nextSongs
    })
  }, [limit])

  return { recentlyPlayed, recordRecentlyPlayed }
}
