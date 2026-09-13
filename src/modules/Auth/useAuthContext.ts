import { useContext } from 'react'

import { AuthContext } from './AuthContext.ts'
import type { AuthContextValue } from './useAuth.ts'

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
