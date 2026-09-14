import type { ChangeEventHandler, FormEventHandler } from 'react'

import Icon from '../../shared/ui/Icon.tsx'

export type AuthMode = 'signin' | 'signup'

export interface AuthFormValue {
  email: string
  password: string
}

export interface AuthFormProps {
  embedded?: boolean
  formValue: AuthFormValue
  isSubmitting: boolean
  mode: AuthMode
  onClose: () => void
  onFieldChange: ChangeEventHandler<HTMLInputElement>
  onModeChange: (isSignUp: boolean) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  submissionMessage: string | null
}

export default function AuthForm({
  embedded = false,
  formValue,
  isSubmitting,
  mode,
  onClose,
  onFieldChange,
  onModeChange,
  onSubmit,
  submissionMessage,
}: AuthFormProps) {
  const isSignUp = mode === 'signup'

  return (
    <div aria-labelledby="auth-title" aria-modal={embedded ? undefined : true} className={embedded ? 'auth-dialog auth-dialog--page' : 'auth-dialog'} role={embedded ? undefined : 'dialog'}>
      <button aria-label="Zamknij formularz" className="auth-dialog__close icon-button" onClick={onClose} type="button"><Icon name="plus" size={20} /></button>
      <div className="auth-dialog__brand"><span /><strong>NORII</strong></div>
      <span className="auth-dialog__eyebrow">{isSignUp ? 'NOWE KONTO' : 'WITAJ PONOWNIE'}</span>
      <h2 id="auth-title">{isSignUp ? 'Zarejestruj się' : 'Zaloguj się'}</h2>
      <p className="auth-dialog__intro">{isSignUp ? 'Utwórz konto i buduj własne playlisty.' : 'Wróć do swojej muzyki i zapisanych kolekcji.'}</p>
      <form className="auth-form" onSubmit={onSubmit}>
        <label><span>Adres e-mail</span><input autoComplete="email" autoFocus name="email" onChange={onFieldChange} placeholder="twoj@email.pl" required type="email" value={formValue.email} /></label>
        <label><span>Hasło</span><input autoComplete={isSignUp ? 'new-password' : 'current-password'} name="password" onChange={onFieldChange} placeholder="••••••••" required type="password" value={formValue.password} /></label>
        {submissionMessage ? <p className="auth-form__message" role="alert">{submissionMessage}</p> : null}
        <button className="button button--primary auth-form__submit" disabled={isSubmitting} type="submit">{isSubmitting ? 'Łączenie…' : isSignUp ? 'Utwórz konto' : 'Zaloguj się'}</button>
      </form>
      <p className="auth-dialog__switch">{isSignUp ? 'Masz już konto?' : 'Nie masz jeszcze konta?'} <button onClick={() => onModeChange(!isSignUp)} type="button">{isSignUp ? 'Zaloguj się' : 'Zarejestruj się'}</button></p>
    </div>
  )
}
