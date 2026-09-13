import { createContext } from 'react'

import type { UIStateContextValue } from './useUIState.ts'

export const UIStateContext = createContext<UIStateContextValue | null>(null)
