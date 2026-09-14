import { Outlet } from 'react-router-dom'

import AppShell from './app/AppShell.tsx'
import { useCurrentPlaybackContext } from './modules/CurrentPlayback/useCurrentPlaybackContext.ts'
import { useUIStateContext } from './modules/UIState/useUIStateContext.ts'
import Aside from './widgets/Aside/Aside.tsx'
import Center from './widgets/Center/Center.tsx'
import Header from './widgets/Header/Header.tsx'
import Play from './widgets/Play/Play.tsx'
import QueueDrawer from './widgets/Queue/QueueDrawer.tsx'
import Signing from './widgets/Signing/Signing.tsx'

export default function MiniSpotify() {
  const { isAuthDialogOpen } = useUIStateContext()
  const { currentSong } = useCurrentPlaybackContext()

  return (
    <AppShell
      header={<Header />}
      overlay={isAuthDialogOpen ? <Signing /> : null}
      player={currentSong ? <Play /> : null}
      queue={<QueueDrawer />}
      sidebar={<Aside />}
    >
      <Center><Outlet /></Center>
    </AppShell>
  )
}
