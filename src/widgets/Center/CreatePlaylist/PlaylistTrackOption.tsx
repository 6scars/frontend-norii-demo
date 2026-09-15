import { getArtworkUrl, getSongId } from '../../../modules/Catalog/song.ts'
import type { EntityId, Song } from '../../../shared/types/domain.ts'

interface PlaylistTrackOptionProps {
  isSelected: boolean
  onToggle: (songId: EntityId) => void
  song: Song
}

export default function PlaylistTrackOption({ isSelected, onToggle, song }: PlaylistTrackOptionProps) {
    const artworkUrl = getArtworkUrl(song)
    const songId = getSongId(song)

    return (
        <div className="song-to-add-container">
            <div className="img-container relative h-full w-[35%] overflow-hidden">
                <img alt="" className="img_song w-full h-full object-cover object-center" src={artworkUrl ?? undefined} />
            </div>
            <div className="song-desc text-[var(--main-color)] w-[55%]">
                <span>{song.song_name}</span><br />
                <span className="text-[var(--help-color3)] text-[0.7rem]">{song.author}</span>
            </div>
            <button
                aria-label={`${isSelected ? 'Remove' : 'Add'} ${song.song_name}`}
                aria-pressed={isSelected}
                className={`${isSelected ? 'added-song' : 'not-added-song'} flex justify-center items-center cursor-pointer w-[10%] h-full border-0 p-0 text-[var(--main-color)]`}
                disabled={songId === null}
                onClick={() => { if (songId !== null) onToggle(songId) }}
                type="button"
            >
                {isSelected ? '\u2611' : '+'}
            </button>
        </div>
    )
}
