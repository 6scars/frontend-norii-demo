import { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../modules/Auth/useAuthContext.js'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.js'
import { APP_ROUTES, getPlaylistRoute } from '../../app/routes.js'
import { useCompactLayout } from '../../shared/hooks/useCompactLayout.js'
import Icon from '../../shared/ui/Icon.jsx'
import Playlists from './PlayLists.jsx'
import './Aside.css'

const navigation = [
  { icon: 'home', label: 'Dla Ciebie', to: APP_ROUTES.home },
  { icon: 'discover', label: 'Odkrywaj', to: APP_ROUTES.discover },
  { icon: 'library', label: 'Biblioteka', to: APP_ROUTES.library },
  { icon: 'heart', label: 'Ulubione', to: APP_ROUTES.favorites },
  { icon: 'playlists', label: 'Playlisty', to: APP_ROUTES.playlists },
  { icon: 'radio', label: 'Radio', to: APP_ROUTES.radio },
]

export default function Aside() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const compact = useCompactLayout()
  const {
    isCreatePlaylistOpen,
    isTrackDetailsOpen,
    setAuthDialogOpen,
    setCreatePlaylistOpen,
    setQueueOpen,
    setSidebarOpen,
    sidebarOpen,
  } = useUIStateContext()
  const { playlists, isAuthenticated } = useAuthContext()

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  useEffect(() => {
    if (isTrackDetailsOpen || !compact) setSidebarOpen(false)
  }, [compact, isTrackDetailsOpen, setSidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setSidebarOpen, sidebarOpen])

  const closeSidebar = () => setSidebarOpen(false)

  const toggleSidebar = () => {
    const nextOpen = !sidebarOpen
    setSidebarOpen(nextOpen)
    if (nextOpen) setQueueOpen(false)
  }

  const toggleCreatePlaylist = () => {
    closeSidebar()
    if (isCreatePlaylistOpen) {
      setCreatePlaylistOpen(false)
    } else {
      if (isAuthenticated) setCreatePlaylistOpen(true)
      if (!isAuthenticated) setAuthDialogOpen(true)
    }
  }

  const choosePlaylist = (playlistId) => {
    setCreatePlaylistOpen(false)
    closeSidebar()
    navigate(getPlaylistRoute(playlistId))
  }

  const showHome = () => {
    setCreatePlaylistOpen(false)
    closeSidebar()
  }

  return (
    <div className={`aside-drawer ${sidebarOpen ? 'aside-drawer--open' : ''}`}>
      <aside
        id="app-navigation"
        aria-hidden={compact && !sidebarOpen}
        className="leftBar aside-drawer__surface red-scroll-bar"
        inert={compact && !sidebarOpen}
      >
        <nav aria-label="Główna nawigacja" className="main-navigation">
          {navigation.map(({ icon, label, to }) => (
            <NavLink
              className={({ isActive }) => isActive ? 'navigation-item navigation-item--active' : 'navigation-item'}
              end={to === APP_ROUTES.home}
              key={label}
              onClick={showHome}
              to={to}
            >
              <Icon name={icon} size={21} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-playlists">
          {playlists?.map((playlist) => (
            <Playlists key={playlist.playlist_id} playlist={playlist} choosePlaylist={choosePlaylist} />
          ))}
        </div>
        <div className="sidebar-footer">
          <button onClick={toggleCreatePlaylist} className="create_playlist_button" type="button">
            <Icon name="plus" size={19} />
            <span>Stwórz playlistę</span>
          </button>
        
        </div>
      </aside>
      <button
        aria-controls="app-navigation"
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? 'Zwiń menu' : 'Otwórz menu'}
        className="aside-drawer__trigger"
        onClick={toggleSidebar}
        type="button"
      >
        <span aria-hidden="true"><i /><i /><i /></span>
      </button>
    </div>
  )
}
