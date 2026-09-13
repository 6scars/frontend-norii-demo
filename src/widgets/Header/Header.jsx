import { useAuthContext } from '../../modules/Auth/useAuthContext.js';
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.js'
import { useNavigate } from 'react-router-dom'
import Icon from '../../shared/ui/Icon.jsx'
import { APP_ROUTES } from '../../app/routes.js'
import './Header.css'
import Sing from './Sing'


export default function Header() {

  const { toggleAuthDialog } = useUIStateContext();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate()

  return (
    <header className="app-header">
       <button aria-label="Strona główna" className="app-header__brand" onClick={() => navigate(APP_ROUTES.home)} type="button"><span /></button>
      <label className="app-header__search">
        <Icon name="search" size={18} />
        <span className="sr-only">Szukaj</span>
        <input placeholder="Szukaj muzyki" type="search" />
      </label>
      <div className="app-header__actions">
        <button aria-label="Wstecz" className="icon-button" onClick={() => navigate(-1)} type="button"><Icon name="chevronLeft" /></button>
        <button aria-label="Dalej" className="icon-button" onClick={() => navigate(1)} type="button"><Icon name="chevronRight" /></button>
        <Sing isAuthenticated={isAuthenticated} onClick={isAuthenticated ? () => navigate(APP_ROUTES.account) : toggleAuthDialog} />
       
      </div>
    </header>
  );
}
