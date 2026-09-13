import { Route, Routes } from 'react-router-dom'

import MiniSpotify from '../App.jsx'
import AccountPage from '../pages/Account/AccountPage.jsx'
import AccountDataPage from '../pages/Account/Settings/AccountData/AccountDataPage.jsx'
import SettingsPage from '../pages/Account/Settings/SettingsPage.jsx'
import ArtistPage from '../pages/Artist/ArtistPage.jsx'
import AuthPage from '../pages/Auth/AuthPage.jsx'
import DiscoverPage from '../pages/Discover/DiscoverPage.jsx'
import FavoritesPage from '../pages/Favorites/FavoritesPage.jsx'
import HomePage from '../pages/Home/HomePage.jsx'
import LibraryPage from '../pages/Library/LibraryPage.jsx'
import NowPlayingPage from '../pages/NowPlaying/NowPlayingPage.jsx'
import MySongsPage from '../pages/MySongs/MySongsPage.jsx'
import PlaylistPage from '../pages/Playlist/PlaylistPage.jsx'
import PlaylistsPage from '../pages/Playlists/PlaylistsPage.jsx'
import RadioPage from '../pages/Radio/RadioPage.jsx'
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx'
import SongUpload from '../widgets/AddSong/AddSong.jsx'
import { APP_ROUTES } from './routes.js'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MiniSpotify />}>
        <Route index element={<HomePage />} />
        <Route element={<AccountPage />} path={APP_ROUTES.account} />
        <Route element={<AccountDataPage />} path={APP_ROUTES.accountData} />
        <Route element={<ArtistPage />} path={APP_ROUTES.artist} />
        <Route element={<DiscoverPage />} path={APP_ROUTES.discover} />
        <Route element={<FavoritesPage />} path={APP_ROUTES.favorites} />
        <Route element={<LibraryPage />} path={APP_ROUTES.library} />
        <Route element={<NowPlayingPage />} path={APP_ROUTES.nowPlaying} />
        <Route element={<MySongsPage />} path={APP_ROUTES.mySongs} />
        <Route element={<PlaylistsPage />} path={APP_ROUTES.playlists} />
        <Route element={<PlaylistPage />} path={APP_ROUTES.playlist} />
        <Route element={<RadioPage />} path={APP_ROUTES.radio} />
        <Route element={<SettingsPage />} path={APP_ROUTES.accountSettings} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<AuthPage mode="signin" />} path={APP_ROUTES.signIn} />
      <Route element={<AuthPage mode="signup" />} path={APP_ROUTES.signUp} />
      <Route element={<SongUpload />} path={APP_ROUTES.addSong} />
    </Routes>
  )
}
