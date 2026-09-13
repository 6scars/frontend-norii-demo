import { useState } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../../../app/routes.js'
import { USERNAME_MAX_LENGTH, updateUsername } from '../../../../modules/Account/account-api.js'
import { readSession } from '../../../../modules/Auth/session-storage.js'
import { useAuthContext } from '../../../../modules/Auth/useAuthContext.js'
import { useUIStateContext } from '../../../../modules/UIState/useUIStateContext.js'
import Icon from '../../../../shared/ui/Icon.jsx'
import './AccountDataPage.css'

export default function AccountDataPage() {
  const { isAuthenticated } = useAuthContext()
  const { setAuthDialogOpen } = useUIStateContext()
  const [username, setUsername] = useState('')
  const [feedback, setFeedback] = useState({ message: '', type: 'idle' })

  if (!isAuthenticated) {
    return (
      <section className="account-data-page account-data-page--guest" role="status">
        <Icon name="library" size={36} />
        <h1>Dane wymagają konta</h1>
        <button className="button button--primary" onClick={() => setAuthDialogOpen(true)} type="button">
          Zaloguj się
        </button>
      </section>
    )
  }

  const isSubmitting = feedback.type === 'loading'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ message: 'Zapisywanie…', type: 'loading' })

    try {
      await updateUsername(username, readSession().token)
      setFeedback({ message: 'Nazwa użytkownika została zapisana.', type: 'success' })
    } catch (error) {
      setFeedback({
        message: error?.message || 'Nie udało się zapisać nazwy użytkownika.',
        type: 'error',
      })
    }
  }

  return (
    <div className="account-data-page">
      <header>
        <span>DANE KONTA</span>
        <h1>Dane</h1>
        <p>Zaktualizuj informacje przypisane do Twojego profilu.</p>
      </header>

      <section className="account-data-card" aria-labelledby="username-section-title">
        <div className="account-data-card__heading">
          <Icon name="library" size={20} />
          <div>
            <h2 id="username-section-title">Profil</h2>
            <p>Ta nazwa będzie identyfikować Cię w aplikacji.</p>
          </div>
        </div>

        <form className="account-data-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Nazwa użytkownika</label>
          <input
            autoComplete="username"
            id="username"
            maxLength={USERNAME_MAX_LENGTH}
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Wpisz nazwę użytkownika"
            required
            type="text"
            value={username}
          />
          <small>Maksymalnie {USERNAME_MAX_LENGTH} znaków.</small>

          <div className="account-data-form__actions">
            <Link className="button button--quiet" to={APP_ROUTES.accountSettings}>Wróć do ustawień</Link>
            <button
              className="button button--primary"
              disabled={isSubmitting || !username.trim()}
              type="submit"
            >
              {isSubmitting ? 'Zapisywanie…' : 'Zapisz zmiany'}
            </button>
          </div>

          <p
            aria-live="polite"
            className={`account-data-form__feedback account-data-form__feedback--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.message}
          </p>
        </form>
      </section>
    </div>
  )
}
