import { useMemo } from 'react'

import { useAuthContext } from '../../modules/Auth/useAuthContext.ts'
import { getSongId } from '../../modules/Catalog/song.ts'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.ts'
import { usePlayerContext } from '../../modules/Player/usePlayerContext.ts'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.ts'
import Icon from '../../shared/ui/Icon.tsx'
import TrackTable from '../../widgets/Tracks/TrackTable.tsx'
import type { EntityId } from '../../shared/types/domain.ts'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const { isAuthenticated, songs } = useAuthContext()
  const { currentSong, setCurrentTrackIndex, setPlaybackQueue } = useCurrentPlaybackContext()
  const { chooseSong } = usePlayerContext()
  const { setAuthDialogOpen } = useUIStateContext()
  const playableSongs = useMemo(
    () => (Array.isArray(songs) ? songs.filter((song) => getSongId(song) !== null && Boolean(song?.song_name)) : []),
    [songs],
  )

  const playTrack = async (songId: EntityId | null) => {
    if (songId === null) return
    const index = playableSongs.findIndex((song) => String(getSongId(song)) === String(songId))
    if (index < 0) return
    setPlaybackQueue(playableSongs)
    setCurrentTrackIndex(index)
    const selectedId = getSongId(playableSongs[index])
    if (selectedId !== null) await chooseSong(selectedId)
  }

  if (!isAuthenticated) {
    return (
      <section className="favorites-page favorites-page--guest" role="status">
        <span className="favorites-page__heart"><Icon name="heart" size={34} /></span>
        <h1>Zaloguj się do ulubionych</h1>
        <p>Połącz konto, aby po wdrożeniu synchronizacji wracać do oznaczonych utworów na każdym urządzeniu.</p>
        <button className="button button--primary" onClick={() => setAuthDialogOpen(true)} type="button">Zaloguj się</button>
      </section>
    )
  }

  return (
    <div className="favorites-page">
      <header className="favorites-hero">
        <span className="favorites-hero__icon"><Icon name="heart" size={54} /></span>
        <div><span className="favorites-hero__eyebrow">TWOJA KOLEKCJA</span><h1>Ulubione</h1><p>Miejsce na utwory, które chcesz mieć zawsze blisko.</p></div>
      </header>
      <aside className="favorites-notice" role="note"><Icon name="more" size={20} /><div><strong>Synchronizacja ulubionych jest w przygotowaniu</strong><p>Aktualny backend nie udostępnia jeszcze zapisu polubień. Niczego nie zapisujemy pozornie tylko w tej przeglądarce.</p></div></aside>
      <section aria-labelledby="favorites-repeat" className="favorites-repeat">
        <div className="favorites-repeat__heading"><div><span>Z REALNEGO KATALOGU</span><h2 id="favorites-repeat">Posłuchaj ponownie</h2></div><small>{playableSongs.length} utworów</small></div>
        <TrackTable
          currentSongId={getSongId(currentSong)}
          emptyMessage="Katalog jest obecnie pusty."
          onPlay={(id) => { void playTrack(id) }}
          tracks={playableSongs}
        />
      </section>
    </div>
  )
}
