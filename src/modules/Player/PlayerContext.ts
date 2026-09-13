import { createContext } from 'react'

import type { PlayerContextValue } from './usePlayer.ts'

export const PlayerContext = createContext<PlayerContextValue | null>(null)
