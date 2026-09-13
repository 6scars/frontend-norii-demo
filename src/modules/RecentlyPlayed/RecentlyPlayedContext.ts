import { createContext } from 'react'

import type { RecentlyPlayedContextValue } from './useRecentlyPlayed.ts'

export const RecentlyPlayedContext =
  createContext<RecentlyPlayedContextValue | null>(null)
