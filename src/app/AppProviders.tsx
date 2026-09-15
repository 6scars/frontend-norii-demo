import type { ReactNode } from 'react'

import { AuthProvider } from '../modules/Auth/AuthProvider.tsx'
import { CurrentPlaybackProvider } from '../modules/CurrentPlayback/CurrentPlaybackProvider.tsx'
import { PlayerProvider } from '../modules/Player/PlayerProvider.tsx'
import { RecentlyPlayedProvider } from '../modules/RecentlyPlayed/RecentlyPlayedProvider.tsx'
import { UIStateProvider } from '../modules/UIState/UIStateProvider.tsx'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UIStateProvider>
        <CurrentPlaybackProvider>
          <RecentlyPlayedProvider>
            <PlayerProvider>{children}</PlayerProvider>
          </RecentlyPlayedProvider>
        </CurrentPlaybackProvider>
      </UIStateProvider>
    </AuthProvider>
  )
}
