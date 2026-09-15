import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../../app/routes.ts'
import { clearSession } from '../../../modules/Auth/session-storage.ts'
import { useAuthContext } from '../../../modules/Auth/useAuthContext.ts'
import { useCurrentPlaybackContext } from '../../../modules/CurrentPlayback/useCurrentPlaybackContext.ts'
import { usePlayerContext } from '../../../modules/Player/usePlayerContext.ts'
import { useUIStateContext } from '../../../modules/UIState/useUIStateContext.ts'
import Icon from '../../../shared/ui/Icon.tsx'
import './SettingsPage.css'

export default function SettingsPage() {
  const { isAuthenticated } = useAuthContext()
  const { currentSong } = useCurrentPlaybackContext()
  const { setAudioVolume, volume } = usePlayerContext()
  const { setAuthDialogOpen } = useUIStateContext()

  if (!isAuthenticated) {
    return (
      <section className="settings-page settings-page--guest" role="status">
        <Icon name="more" size={36} />
        <h1>Ustawienia wymagają konta</h1>
        <button className="button button--primary" onClick={() => setAuthDialogOpen(true)} type="button">
          Zaloguj się
        </button>
      </section>
    )
  }

  const logOut = () => {
    clearSession()
    window.location.reload()
  }

  return (
    <div className="settings-page">
      <header>
        <span>USTAWIENIA UŻYTKOWNIKA</span>
        <h1>Ustawienia</h1>
        <p>Kontroluj działające preferencje bez pozorowanych opcji.</p>
      </header>

      <section className="settings-group">
        <div className="settings-group__heading">
          <Icon name="play" size={20} />
          <div>
            <h2>Odtwarzanie</h2>
            <p>Głośność wspólnego odtwarzacza.</p>
          </div>
        </div>
        <label className="settings-volume">
          <span>Głośność <strong>{Math.round(volume * 100)}%</strong></span>
          <input
            disabled={!currentSong}
            max="1"
            min="0"
            onChange={(event) => setAudioVolume(Number(event.target.value))}
            step="0.01"
            type="range"
            value={volume}
          />
          <small>
            {currentSong
              ? 'Zmiana zostanie zastosowana natychmiast.'
              : 'Uruchom utwór, aby zmienić głośność.'}
          </small>
        </label>
      </section>

      <section className="settings-group">
        <div className="settings-group__heading">
          <Icon name="discover" size={20} />
          <div>
            <h2>Wygląd</h2>
            <p>Aktualna konfiguracja projektu.</p>
          </div>
        </div>
        <div className="settings-row">
          <span>
            <strong>Ciemny motyw</strong>
            <small>Czerń, biel i stonowany czerwony akcent.</small>
          </span>
          <span className="settings-badge">Aktywny</span>
        </div>
      </section>

      <section className="settings-group">
        <div className="settings-group__heading">
          <Icon name="library" size={20} />
          <div>
            <h2>Konto</h2>
            <p>Sesja i dostęp do profilu.</p>
          </div>
        </div>
        <div className="settings-row">
          <span>
            <strong>Dane</strong>
            <small>Zmień informacje widoczne na Twoim koncie.</small>
          </span>
          <Link className="button button--quiet" to={APP_ROUTES.accountData}>Edytuj dane</Link>
        </div>
        <div className="settings-account-actions">
          <Link className="button button--quiet" to={APP_ROUTES.account}>Wróć do konta</Link>
          <button className="settings-logout" onClick={logOut} type="button">Wyloguj się</button>
        </div>
      </section>
    </div>
  )
}
