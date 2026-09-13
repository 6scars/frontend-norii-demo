import { useContext } from 'react'

import { PlayerContext } from './PlayerContext.ts'
import type { PlayerContextValue } from './usePlayer.ts'

export function usePlayerContext(): PlayerContextValue {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayerContext must be used within PlayerProvider')
  }
  return context
}
