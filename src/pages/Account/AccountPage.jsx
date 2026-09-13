import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../app/routes.js'
import { readSession } from '../../modules/Auth/session-storage.js'
import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.js'
import Icon from '../../shared/ui/Icon.jsx'
import './AccountPage.css'

export default function AccountPage() {
  const { isAuthenticated, playlists } = useAuthContext()
  const { setAuthDialogOpen } = useUIStateContext()
  const { userId } = readSession()

  if (!isAuthenticated) {
    return (
      <section className="account-page account-page--guest" role="status">
        <Icon name="library" size={38} />
        <h1>Zaloguj się do konta</h1>
        <p>Twoje dane konta są dostępne dopiero po poprawnym uwierzytelnieniu.</p>
        <button className="button button--primary" onClick={() => setAuthDialogOpen(true)} type="button">
          Zaloguj się
        </button>
      </section>
    )
  }

  return (
    <div className="account-page">
      <header className="account-profile">
        <span className="account-profile__avatar">K</span>
        <div>
          <span className="account-profile__eyebrow">KONTO UŻYTKOWNIKA</span>
          <h1>Twój profil</h1>
          <p>Identyfikator użytkownika: {userId || '—'}</p>
        </div>
      </header>

      <section aria-label="Podsumowanie konta" className="account-stats">
        <article>
          <strong>{Array.isArray(playlists) ? playlists.length : 0}</strong>
          <span>Twoje playlisty</span>
        </article>
        <article>
          <strong>Aktywne</strong>
          <span>Stan konta</span>
        </article>
        <article>
          <strong>Ciemny</strong>
          <span>Motyw interfejsu</span>
        </article>
      </section>

      <section className="account-actions">
        <div>
          <span>ZARZĄDZANIE</span>
          <h2>Co chcesz zrobić?</h2>
        </div>
        <div className="account-actions__grid">
          <Link to={APP_ROUTES.addSong}>
            <Icon name="plus" size={24} />
            <strong>Dodaj utwór</strong>
            <small>Prześlij okładkę JPG/PNG i plik MP3.</small>
          </Link>
          <Link to={APP_ROUTES.accountSettings}>
            <Icon name="more" size={24} />
            <strong>Ustawienia</strong>
            <small>Dostosuj odtwarzanie i sprawdź stan interfejsu.</small>
          </Link>
          <Link to={APP_ROUTES.playlists}>
            <Icon name="playlists" size={24} />
            <strong>Playlisty</strong>
            <small>Zarządzaj własnymi kolekcjami muzyki.</small>
          </Link>
          <Link to={APP_ROUTES.mySongs}>
            <Icon name="queue" size={24} />
            <strong>Moje utwory</strong>
            <small>Przeglądaj i usuwaj własne publikacje.</small>
          </Link>
        </div>
      </section>
    </div>
  )
}
