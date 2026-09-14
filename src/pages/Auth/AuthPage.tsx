import { useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import Signing from '../../widgets/Signing/Signing.tsx'
import type { AuthMode } from '../../widgets/Signing/AuthForm.tsx'
import './AuthPage.css'

interface AuthPageProps {
  mode: AuthMode
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthContext()
  const close = useCallback(() => { void navigate(APP_ROUTES.home) }, [navigate])
  const changeMode = useCallback(
    (nextMode: AuthMode) => { void navigate(nextMode === 'signup' ? APP_ROUTES.signUp : APP_ROUTES.signIn) },
    [navigate],
  )

  if (isAuthenticated) return <Navigate replace to={APP_ROUTES.account} />

  return <Signing defaultMode={mode} onClose={close} onModeChange={changeMode} presentation="page" />
}
