import { Outlet } from 'react-router-dom'

import AppShell from './app/AppShell.jsx'
import { useCurrentPlaybackContext } from './modules/CurrentPlayback/useCurrentPlaybackContext.js'
import { useUIStateContext } from './modules/UIState/useUIStateContext.js'
import Aside from './widgets/Aside/Aside.jsx'
import Center from './widgets/Center/Center.jsx'
import Header from './widgets/Header/Header.jsx'
import Play from './widgets/Play/Play.jsx'
import QueueDrawer from './widgets/Queue/QueueDrawer.jsx'
import Signing from './widgets/Signing/Signing.jsx'

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
