import { createContext } from 'react'

import type { AuthContextValue } from './useAuth.ts'

export const AuthContext = createContext<AuthContextValue | null>(null)
