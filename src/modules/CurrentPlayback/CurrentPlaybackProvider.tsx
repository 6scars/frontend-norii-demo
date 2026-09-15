import type { PropsWithChildren } from 'react'

import { CurrentPlaybackContext } from './CurrentPlaybackContext.ts'
import { useCurrentPlaybackState } from './useCurrentPlaybackState.ts'

export function CurrentPlaybackProvider({ children }: PropsWithChildren) {
  const playbackState = useCurrentPlaybackState()

  return (
    <CurrentPlaybackContext.Provider value={playbackState}>
      {children}
    </CurrentPlaybackContext.Provider>
  )
}
