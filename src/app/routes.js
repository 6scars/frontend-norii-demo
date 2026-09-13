export const APP_ROUTES = Object.freeze({
  home: '/',
  discover: '/discover',
  library: '/library',
  favorites: '/favorites',
  playlists: '/playlists',
  playlist: '/playlists/:playlistId',
  radio: '/radio',
  nowPlaying: '/now-playing',
  signIn: '/login',
  signUp: '/register',
  account: '/account',
  accountSettings: '/account/settings',
  accountData: '/account/settings/data',
  artist: '/artists/:artistName',
  addSong: '/addSong',
  mySongs: '/my-songs',
})

export function getPlaylistRoute(playlistId) {
  return `${APP_ROUTES.playlists}/${encodeURIComponent(String(playlistId))}`
}

export function getArtistRoute(artistName) {
  return `/artists/${encodeURIComponent(String(artistName))}`
}
