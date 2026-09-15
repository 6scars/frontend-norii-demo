import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import { authenticate } from '../../modules/Auth/auth-api.ts'
import { saveSession } from '../../modules/Auth/session-storage.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import { getErrorMessage } from '../../shared/errors/get-error-message.ts'
import AccountOptions from './AccountOptions/AccountOptions.tsx'
import SignIn from './SignIn.tsx'
import SignUp from './SignUp.tsx'
import type { AuthFormValue, AuthMode } from './AuthForm.tsx'
import './Signing.css'

interface SigningProps {
  defaultMode?: AuthMode
  onClose?: () => void
  onModeChange?: (mode: AuthMode) => void
  presentation?: 'overlay' | 'page'
}

export default function Signing({ defaultMode = 'signin', onClose, onModeChange, presentation = 'overlay' }: SigningProps) {
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null)
  const [formValue, setFormValue] = useState<AuthFormValue>({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(defaultMode === 'signup')
  const { isAuthenticated } = useAuthContext()
  const { toggleAuthDialog } = useUIStateContext()
  const close = onClose ?? toggleAuthDialog

  useEffect(() => {
    setIsSignUpMode(defaultMode === 'signup')
  }, [defaultMode])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [close])

  const updateFormField = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmissionMessage(null)
    const field = event.target.name as keyof AuthFormValue
    setFormValue((currentValue) => ({ ...currentValue, [field]: event.target.value }))
  }

  const changeForm = (nextValue: boolean) => {
    setSubmissionMessage(null)
    const nextMode: AuthMode = nextValue ? 'signup' : 'signin'
    if (onModeChange) onModeChange(nextMode)
    else setIsSignUpMode(nextValue)
  }

  const submitAuthForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmissionMessage(null)

    try {
      const data = await authenticate(isSignUpMode ? 'signup' : 'signin', formValue)

      if (data.token && data.user_id != null) {
        saveSession({ token: data.token, userId: data.user_id })
        window.location.reload()
        return
      }

      setSubmissionMessage(data.message ?? (isSignUpMode ? 'Konto utworzone. Możesz się zalogować.' : 'Brak kompletnej sesji w odpowiedzi serwera.'))
      if (isSignUpMode) setIsSignUpMode(false)
    } catch (error) {
      setSubmissionMessage(getErrorMessage(error, 'Nie udało się połączyć z serwerem'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) return <div className="auth-overlay"><button aria-label="Zamknij menu konta" className="auth-overlay__backdrop" onClick={close} type="button" /><AccountOptions onClose={close} /></div>

  const formProps = {
    embedded: presentation === 'page',
    formValue,
    isSubmitting,
    onClose: close,
    onFieldChange: updateFormField,
    onModeChange: changeForm,
    onSubmit: submitAuthForm,
    submissionMessage,
  }

  const form = isSignUpMode ? <SignUp {...formProps} /> : <SignIn {...formProps} />

  if (presentation === 'page') {
    return <div className="auth-page"><section className="auth-page__visual"><div className="auth-page__brand"><span /><strong>NORII</strong></div><div><span>{isSignUpMode ? 'NOWY ROZDZIAŁ' : 'TWOJA MUZYKA'}</span><h1>{isSignUpMode ? 'Zacznij słuchać po swojemu.' : 'Wróć do dźwięków, które są Twoje.'}</h1><p>Ciemna przestrzeń dla muzyki, bez zbędnego hałasu.</p></div><i aria-hidden="true" /></section><main className="auth-page__form">{form}</main></div>
  }

  return <div className="auth-overlay"><button aria-label="Zamknij formularz" className="auth-overlay__backdrop" onClick={close} type="button" />{form}</div>
}
