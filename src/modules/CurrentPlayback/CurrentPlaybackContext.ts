import { createContext } from 'react'

import type { CurrentPlaybackContextValue } from './useCurrentPlaybackState.ts'

export const CurrentPlaybackContext =
  createContext<CurrentPlaybackContextValue | null>(null)
