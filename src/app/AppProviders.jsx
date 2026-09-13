import { AuthProvider } from '../modules/Auth/AuthProvider.jsx'
import { CurrentPlaybackProvider } from '../modules/CurrentPlayback/CurrentPlaybackProvider.jsx'
import { PlayerProvider } from '../modules/Player/PlayerProvider.jsx'
import { RecentlyPlayedProvider } from '../modules/RecentlyPlayed/RecentlyPlayedProvider.jsx'
import { UIStateProvider } from '../modules/UIState/UIStateProvider.jsx'

export default function AppProviders({ children }) {
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
