import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import CreatePlaylist from './CreatePlaylist/CreatePlaylist.tsx'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import './Center.css'

export default function Center({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isCreatePlaylistOpen, setCreatePlaylistOpen } = useUIStateContext()
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const isCreatePlaylistRoute = normalizedPath === '/create-playlist'
  const previousCreatePlaylistOpen = useRef(isCreatePlaylistOpen)
  const previousCreatePlaylistRoute = useRef(false)

  useEffect(() => {
    const wasCreatePlaylistOpen = previousCreatePlaylistOpen.current
    const wasCreatePlaylistRoute = previousCreatePlaylistRoute.current

    previousCreatePlaylistOpen.current = isCreatePlaylistOpen
    previousCreatePlaylistRoute.current = isCreatePlaylistRoute

    if (isCreatePlaylistRoute && !wasCreatePlaylistRoute && !isCreatePlaylistOpen) {
      setCreatePlaylistOpen(true)
      return
    }

    if (!isCreatePlaylistRoute && wasCreatePlaylistRoute && isCreatePlaylistOpen) {
      setCreatePlaylistOpen(false)
      return
    }

    if (isCreatePlaylistOpen && !wasCreatePlaylistOpen && !isCreatePlaylistRoute) {
      void navigate('/create-playlist')
    }
  }, [isCreatePlaylistOpen, isCreatePlaylistRoute, navigate, setCreatePlaylistOpen])

  return (
    <main className="Center">
      <div className="music center-primary red-scroll-bar">
        {isCreatePlaylistOpen || isCreatePlaylistRoute ? <CreatePlaylist /> : children}
      </div>
    </main>
  )
}
