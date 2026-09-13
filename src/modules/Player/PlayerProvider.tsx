import type { PropsWithChildren } from 'react'

import { PlayerContext } from './PlayerContext.ts'
import { usePlayer } from './usePlayer.ts'

export function PlayerProvider({ children }: PropsWithChildren) {
  const player = usePlayer()

  return (
    <PlayerContext.Provider value={player}>
      {children}
    </PlayerContext.Provider>
  )
}
