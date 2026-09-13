import type { PropsWithChildren } from 'react'

import { UIStateContext } from './UIStateContext.ts'
import { useUIState } from './useUIState.ts'

export function UIStateProvider({ children }: PropsWithChildren) {
  const ui = useUIState()

  return (
    <UIStateContext.Provider value={ui}>
      {children}
    </UIStateContext.Provider>
  )
}
