import { RecentlyPlayedContext } from './RecentlyPlayedContext.js'
import { useRecentlyPlayed } from './useRecentlyPlayed.js'

export function RecentlyPlayedProvider({ children }) {
  const recentlyPlayed = useRecentlyPlayed()

  return (
    <RecentlyPlayedContext.Provider value={recentlyPlayed}>
      {children}
    </RecentlyPlayedContext.Provider>
  )
}
