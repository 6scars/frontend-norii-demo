import { useNavigate } from 'react-router-dom'

import { getPlaylistRoute } from '../../app/routes.ts'
import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import { getArtworkUrl } from '../../modules/Catalog/song.ts'
import { useLibrary } from '../../modules/Library/useLibrary.ts'
import type { LibrarySort } from '../../modules/Library/library-model.ts'
import type { EntityId } from '../../shared/types/domain.ts'
import { getPlaylistSongCount } from '../../modules/Playlists/playlist-collection.ts'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import FilterTabs from '../../shared/ui/FilterTabs/FilterTabs.tsx'
import Icon from '../../shared/ui/Icon.tsx'
import SearchField from '../../shared/ui/SearchField/SearchField.tsx'
import './LibraryPage.css'

const libraryFilters = [
  { value: 'playlists', label: 'Playlisty' },
  { value: 'albums', label: 'Albumy', disabled: true, title: 'Backend nie udostępnia jeszcze zapisanych albumów' },
  { value: 'artists', label: 'Artyści', disabled: true, title: 'Backend nie udostępnia jeszcze obserwowanych artystów' },
] as const

export default function LibraryPage() {
  const navigate = useNavigate()
  const { isAuthenticated, playlists } = useAuthContext()
  const { setAuthDialogOpen, setCreatePlaylistOpen } = useUIStateContext()
  const { layout, model, query, setLayout, setQuery, setSort, sort } = useLibrary(playlists)

  const openPlaylist = (playlistId: EntityId) => {
    setCreatePlaylistOpen(false)
    void navigate(getPlaylistRoute(playlistId))
  }

  const createPlaylist = () => {
    if (isAuthenticated) setCreatePlaylistOpen(true)
    else setAuthDialogOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <section className="library-page library-page--guest" role="status">
        <Icon name="library" size={34} />
        <h1>Twoja biblioteka czeka</h1>
        <p>Zaloguj się, aby zobaczyć własne playlisty i wracać do zapisanej muzyki.</p>
        <button className="button button--primary" onClick={() => setAuthDialogOpen(true)} type="button">Zaloguj się</button>
      </section>
    )
  }

  return (
    <div className="library-page">
      <header className="library-heading"><div><h1>Twoja biblioteka</h1><p>Wszystko, do czego chcesz wracać.</p></div><button className="button button--primary" onClick={createPlaylist} type="button"><Icon name="plus" size={17} /> Nowa playlista</button></header>
      <p className="library-count">{model.total} {model.total === 1 ? 'zapisana pozycja' : 'zapisanych pozycji'}</p>
      <div className="library-toolbar">
        <FilterTabs label="Typ zasobów biblioteki" onChange={() => {}} options={libraryFilters} value="playlists" />
        <SearchField label="Szukaj w bibliotece" onChange={setQuery} value={query} />
        <select aria-label="Sortowanie biblioteki" onChange={(event) => setSort(event.target.value as LibrarySort)} value={sort}><option value="recent">Ostatnio dodane</option><option value="name">Nazwa A–Z</option></select>
        <button aria-label={layout === 'grid' ? 'Pokaż jako listę' : 'Pokaż jako siatkę'} className="icon-button" onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')} type="button"><Icon name={layout === 'grid' ? 'playlists' : 'library'} size={18} /></button>
      </div>

      {model.items.length ? (
        <div className={`library-items library-items--${layout}`}>
          {model.items.map((playlist) => {
            const count = getPlaylistSongCount(playlist)
            const firstImage = playlist.song_images?.[0]
            const artwork = firstImage ? getArtworkUrl({ song_image: firstImage }) : null
            return (
              <button className="library-item" key={playlist.playlist_id} onClick={() => openPlaylist(playlist.playlist_id)} type="button">
                <span className="library-item__art">{artwork ? <img alt="" src={artwork} /> : <Icon name="playlists" size={30} />}</span>
                <span className="library-item__copy"><strong>{playlist.playlist_name}</strong><small>Playlista · {count} {count === 1 ? 'utwór' : 'utworów'}</small></span>
                <span className="library-item__arrow"><Icon name="chevronRight" size={17} /></span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="library-empty" role="status"><Icon name="search" size={28} /><h2>{query ? 'Brak wyników' : 'Nie masz jeszcze playlist'}</h2><p>{query ? `Nie znaleźliśmy playlisty pasującej do „${query}”.` : 'Utwórz pierwszą playlistę i dodaj do niej muzykę.'}</p>{query ? <button className="button button--quiet" onClick={() => setQuery('')} type="button">Wyczyść wyszukiwanie</button> : <button className="button button--primary" onClick={createPlaylist} type="button">Utwórz playlistę</button>}</div>
      )}
    </div>
  )
}
