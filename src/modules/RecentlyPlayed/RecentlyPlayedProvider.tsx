import type { PropsWithChildren } from 'react'

import { RecentlyPlayedContext } from './RecentlyPlayedContext.ts'
import { useRecentlyPlayed } from './useRecentlyPlayed.ts'

export function RecentlyPlayedProvider({ children }: PropsWithChildren) {
  const recentlyPlayed = useRecentlyPlayed()

  return (
    <RecentlyPlayedContext.Provider value={recentlyPlayed}>
      {children}
    </RecentlyPlayedContext.Provider>
  )
}
