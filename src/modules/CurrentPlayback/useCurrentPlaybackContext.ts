import { useContext } from 'react'

import { CurrentPlaybackContext } from './CurrentPlaybackContext.ts'
import type { CurrentPlaybackContextValue } from './useCurrentPlaybackState.ts'

export function useCurrentPlaybackContext(): CurrentPlaybackContextValue {
  const context = useContext(CurrentPlaybackContext)
  if (!context) {
    throw new Error(
      'useCurrentPlaybackContext must be used within CurrentPlaybackProvider',
    )
  }
  return context
}
