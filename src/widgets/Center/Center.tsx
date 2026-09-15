import type { ReactNode } from 'react'

import CreatePlaylist from './CreatePlaylist/CreatePlaylist.tsx'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import './Center.css'

export default function Center({ children }: { children: ReactNode }) {
  const { isCreatePlaylistOpen } = useUIStateContext()
  const { songs } = useAuthContext()

  return (
    <main className="Center">
      <div className="music center-primary red-scroll-bar">
        {isCreatePlaylistOpen ? <CreatePlaylist songs={songs} /> : children}
      </div>
    </main>
  )
}
