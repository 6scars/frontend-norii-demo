import { useEffect, useState } from 'react'

import { authenticate } from '../../modules/Auth/auth-api.js'
import { saveSession } from '../../modules/Auth/session-storage.js'
import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.js'
import AccountOptions from './AccountOptions/AccountOptions.jsx'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import './Signing.css'

export default function Signing({ defaultMode = 'signin', onClose, onModeChange, presentation = 'overlay' }) {
  const [submissionMessage, setSubmissionMessage] = useState(null)
  const [formValue, setFormValue] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(defaultMode === 'signup')
  const { isAuthenticated } = useAuthContext()
  const { toggleAuthDialog } = useUIStateContext()
  const close = onClose || toggleAuthDialog

  useEffect(() => {
    setIsSignUpMode(defaultMode === 'signup')
  }, [defaultMode])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [close])

  const updateFormField = (event) => {
    setSubmissionMessage(null)
    setFormValue((currentValue) => ({ ...currentValue, [event.target.name]: event.target.value }))
  }

  const changeForm = (nextValue) => {
    setSubmissionMessage(null)
    if (onModeChange) onModeChange(nextValue ? 'signup' : 'signin')
    else setIsSignUpMode(nextValue)
  }

  const submitAuthForm = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmissionMessage(null)

    try {
      const data = await authenticate(isSignUpMode ? 'signup' : 'signin', formValue)

      if (data.token) {
        saveSession({ token: data.token, userId: data.user_id })
        window.location.reload()
        return
      }

      setSubmissionMessage(data.message || (isSignUpMode ? 'Konto utworzone. Możesz się zalogować.' : 'Brak tokenu w odpowiedzi serwera.'))
      if (isSignUpMode) setIsSignUpMode(false)
    } catch (error) {
      setSubmissionMessage(error.message || 'Nie udało się połączyć z serwerem')
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
