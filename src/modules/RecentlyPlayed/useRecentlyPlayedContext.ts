import { useContext } from 'react'

import { RecentlyPlayedContext } from './RecentlyPlayedContext.ts'
import type { RecentlyPlayedContextValue } from './useRecentlyPlayed.ts'

export function useRecentlyPlayedContext(): RecentlyPlayedContextValue {
  const context = useContext(RecentlyPlayedContext)
  if (!context) {
    throw new Error(
      'useRecentlyPlayedContext must be used within RecentlyPlayedProvider',
    )
  }
  return context
}
