import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getPlaylistRoute } from '../../app/routes.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import { getArtworkUrl } from '../../modules/Catalog/song.ts'
import { getPlaylistSongCount } from '../../modules/Playlists/playlist-collection.ts'
import { buildPlaylistOverview } from '../../modules/Playlists/playlist-overview.ts'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import FilterTabs from '../../shared/ui/FilterTabs/FilterTabs.tsx'
import Icon from '../../shared/ui/Icon.tsx'
import SearchField from '../../shared/ui/SearchField/SearchField.tsx'
import type { EntityId } from '../../shared/types/domain.ts'
import './PlaylistsPage.css'

const playlistTabs = [
  { value: 'mine', label: 'Moje' },
  { value: 'saved', label: 'Zapisane', disabled: true, title: 'Backend nie udostępnia jeszcze zapisanych cudzych playlist' },
] as const

export default function PlaylistsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, playlists } = useAuthContext()
  const { setAuthDialogOpen, setCreatePlaylistOpen } = useUIStateContext()
  const [query, setQuery] = useState('')
  const model = useMemo(() => buildPlaylistOverview(playlists, query), [playlists, query])

  const openPlaylist = (playlistId: EntityId) => {
    setCreatePlaylistOpen(false)
    void navigate(getPlaylistRoute(playlistId))
  }

  const createPlaylist = () => {
    if (isAuthenticated) setCreatePlaylistOpen(true)
    else setAuthDialogOpen(true)
  }

  if (!isAuthenticated) {
    return <section className="playlists-page playlists-page--guest" role="status"><Icon name="playlists" size={36} /><h1>Zaloguj się do swoich playlist</h1><p>Twórz kolekcje, układaj utwory i wracaj do nich na każdym odsłuchu.</p><button className="button button--primary" onClick={() => setAuthDialogOpen(true)} type="button">Zaloguj się</button></section>
  }

  const featured = model.featured
  const featuredImage = featured?.song_images?.[0]
  const featuredArtwork = featuredImage ? getArtworkUrl({ song_image: featuredImage }) : null

  return (
    <div className="playlists-page">
      <header className="playlists-heading"><div><h1>Twoje playlisty</h1><p>Każdy moment ma swoją ścieżkę.</p></div><button className="button button--primary" onClick={createPlaylist} type="button"><Icon name="plus" size={17} /> Stwórz playlistę</button></header>
      <div className="playlists-toolbar"><FilterTabs label="Rodzaj playlist" onChange={() => {}} options={playlistTabs} value="mine" /><SearchField label="Szukaj w playlistach" onChange={setQuery} value={query} /></div>

      {featured && !query ? (
        <section className="playlist-feature" aria-labelledby="featured-playlist">
          {featuredArtwork ? <img alt="" className="playlist-feature__background" src={featuredArtwork} /> : null}
          <span className="playlist-feature__art">{featuredArtwork ? <img alt="" src={featuredArtwork} /> : <Icon name="playlists" size={44} />}</span>
          <div><span className="playlist-feature__eyebrow">WYRÓŻNIONA PLAYLISTA</span><h2 id="featured-playlist">{featured.playlist_name}</h2><p>{getPlaylistSongCount(featured)} {getPlaylistSongCount(featured) === 1 ? 'utwór' : 'utworów'} w tej kolekcji.</p><button className="button button--quiet" onClick={() => openPlaylist(featured.playlist_id)} type="button">Otwórz playlistę <Icon name="chevronRight" size={16} /></button></div>
        </section>
      ) : null}

      <section className="playlists-section" aria-labelledby="all-playlists"><div className="playlists-section__heading"><h2 id="all-playlists">Wszystkie playlisty</h2><span>{model.total}</span></div>{model.items.length ? <div className="playlists-grid">{model.items.map((playlist) => { const firstImage = playlist.song_images?.[0]; const artwork = firstImage ? getArtworkUrl({ song_image: firstImage }) : null; const count = getPlaylistSongCount(playlist); return <button className="playlist-card" key={playlist.playlist_id} onClick={() => openPlaylist(playlist.playlist_id)} type="button"><span className="playlist-card__art">{artwork ? <img alt="" src={artwork} /> : <Icon name="playlists" size={32} />}</span><strong>{playlist.playlist_name}</strong><small>{count} {count === 1 ? 'utwór' : 'utworów'}</small></button> })}<button className="playlist-create-tile" onClick={createPlaylist} type="button"><Icon name="plus" size={32} /><span>Nowa playlista</span></button></div> : <div className="playlists-empty" role="status"><h2>{query ? 'Brak pasujących playlist' : 'Utwórz pierwszą playlistę'}</h2><p>{query ? `Nie znaleźliśmy nic dla „${query}”.` : 'Dodaj utwory i zbuduj własną kolekcję.'}</p><button className="button button--quiet" onClick={query ? () => setQuery('') : createPlaylist} type="button">{query ? 'Wyczyść wyszukiwanie' : 'Utwórz playlistę'}</button></div>}</section>
    </div>
  )
}
