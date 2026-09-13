import { getArtworkUrl } from '../../../modules/Catalog/song.js'

export default function PlaylistTrackOption({ isSelected, onToggle, song }) {
    const artworkUrl = getArtworkUrl(song)

    return (
        <div className="song-to-add-container">
            <div className="img-container relative h-full w-[35%] overflow-hidden">
                <img alt="" className="img_song w-full h-full object-cover object-center" src={artworkUrl} />
            </div>
            <div className="song-desc text-[var(--main-color)] w-[55%]">
                <span>{song.song_name}</span><br />
                <span className="text-[var(--help-color3)] text-[0.7rem]">{song.author}</span>
            </div>
            <button
                aria-label={`${isSelected ? 'Remove' : 'Add'} ${song.song_name}`}
                aria-pressed={isSelected}
                className={`${isSelected ? 'added-song' : 'not-added-song'} flex justify-center items-center cursor-pointer w-[10%] h-full border-0 p-0 text-[var(--main-color)]`}
                onClick={() => onToggle(song.song_id)}
                type="button"
            >
                {isSelected ? '\u2611' : '+'}
            </button>
        </div>
    )
}
