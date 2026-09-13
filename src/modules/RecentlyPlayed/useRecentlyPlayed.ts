import { useCallback, useState } from 'react'

import type { Song } from '../../shared/types/domain.ts'
import {
  addRecentlyPlayed,
  readRecentlyPlayed,
  RECENTLY_PLAYED_LIMIT,
  saveRecentlyPlayed,
} from './recently-played.ts'

export interface RecentlyPlayedContextValue {
  recentlyPlayed: Song[]
  recordRecentlyPlayed: (song: Song) => void
}

export function useRecentlyPlayed(
  limit = RECENTLY_PLAYED_LIMIT,
): RecentlyPlayedContextValue {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(readRecentlyPlayed)

  const recordRecentlyPlayed = useCallback(
    (song: Song): void => {
      setRecentlyPlayed((currentSongs) => {
        const nextSongs = addRecentlyPlayed(currentSongs, song, limit)
        saveRecentlyPlayed(nextSongs)
        return nextSongs
      })
    },
    [limit],
  )

  return { recentlyPlayed, recordRecentlyPlayed }
}
