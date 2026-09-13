import { useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import Signing from '../../widgets/Signing/Signing.jsx'
import './AuthPage.css'

export default function AuthPage({ mode }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthContext()
  const close = useCallback(() => navigate(APP_ROUTES.home), [navigate])
  const changeMode = useCallback(
    (nextMode) => navigate(nextMode === 'signup' ? APP_ROUTES.signUp : APP_ROUTES.signIn),
    [navigate],
  )

  if (isAuthenticated) return <Navigate replace to={APP_ROUTES.account} />

  return <Signing defaultMode={mode} onClose={close} onModeChange={changeMode} presentation="page" />
}
