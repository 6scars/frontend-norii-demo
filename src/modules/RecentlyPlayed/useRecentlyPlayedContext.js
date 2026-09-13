import { useContext } from 'react'

import { RecentlyPlayedContext } from './RecentlyPlayedContext.js'

export function useRecentlyPlayedContext() {
  return useContext(RecentlyPlayedContext)
}
