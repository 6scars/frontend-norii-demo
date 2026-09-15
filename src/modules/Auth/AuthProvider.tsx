import type { PropsWithChildren } from 'react'

import { AuthContext } from './AuthContext.ts'
import { useAuth } from './useAuth.ts'

export function AuthProvider({ children }: PropsWithChildren) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
