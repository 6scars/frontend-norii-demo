import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

import { APP_ROUTES } from './routes.ts'
import { useCurrentPlaybackContext } from '../modules/CurrentPlayback/useCurrentPlaybackContext.ts'
import { useUIStateContext } from '../modules/UIState/useUIStateContext.ts'
import { useCompactLayout } from '../shared/hooks/useCompactLayout.ts'
import DescriptionDrawer from '../widgets/Center/DescriptionDrawer.tsx'
import './AppShell.css'

interface AppShellProps {
  sidebar: ReactNode
  header: ReactNode
  queue: ReactNode
  player: ReactNode
  overlay: ReactNode
  children: ReactNode
}

export default function AppShell({ sidebar, header, queue, player, overlay, children }: AppShellProps) {
  const { pathname } = useLocation()
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const isImmersive = normalizedPath === APP_ROUTES.nowPlaying
  const { isTrackDetailsOpen, queueOpen, sidebarOpen } = useUIStateContext()
  const { currentSong } = useCurrentPlaybackContext()
  const compact = useCompactLayout()
  const detailsOpen = Boolean(isTrackDetailsOpen && currentSong && !isImmersive)
  const compactPanelOpen = compact && (detailsOpen || sidebarOpen || queueOpen)

  return (
    <div className={`app-shell ${player ? 'app-shell--playing' : ''} ${isImmersive ? 'app-shell--immersive' : ''} ${detailsOpen ? 'app-shell--details-open' : ''}`}>
      <div className="app-shell__sidebar" inert={detailsOpen && compact}>{sidebar}</div>
      <div className="app-shell__header" inert={compactPanelOpen}>{header}</div>
      <div className="app-shell__workspace" inert={compactPanelOpen}>
        {children}
      </div>
      <DescriptionDrawer isOpen={detailsOpen} compact={compact} />
      {isImmersive ? null : queue}
      {player}
      {overlay}
    </div>
  )
}
