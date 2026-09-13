import { useContext } from 'react'

import { UIStateContext } from './UIStateContext.ts'
import type { UIStateContextValue } from './useUIState.ts'

export function useUIStateContext(): UIStateContextValue {
  const context = useContext(UIStateContext)
  if (!context) {
    throw new Error('useUIStateContext must be used within UIStateProvider')
  }
  return context
}
