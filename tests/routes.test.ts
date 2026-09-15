import test from 'node:test'
import assert from 'node:assert/strict'

import { APP_ROUTES, getArtistRoute, getPlaylistRoute } from '../src/app/routes.ts'

await test('podstawowe trasy zachowują Home i istniejący formularz dodawania utworu', () => {
  assert.deepEqual(APP_ROUTES, {
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
})

await test('profil twórcy koduje nazwę wykonawcy w adresie', () => {
  assert.equal(getArtistRoute('Karaś/Rogucki'), '/artists/Kara%C5%9B%2FRogucki')
})

await test('szczegóły playlisty używają stabilnego i bezpiecznego identyfikatora', () => {
  assert.equal(getPlaylistRoute(42), '/playlists/42')
  assert.equal(getPlaylistRoute('nocne światła/2026'), '/playlists/nocne%20%C5%9Bwiat%C5%82a%2F2026')
})
