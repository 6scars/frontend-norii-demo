import { useState } from 'react'

import PlaylistTrackOption from './PlaylistTrackOption'

import './CreatePlaylist.css'

import { useAuthContext } from '../../../modules/Auth/useAuthContext.js'
import { readSession } from '../../../modules/Auth/session-storage.js'
import { createPlaylist } from '../../../modules/Playlists/playlists-api.js'

export default function CreatePlaylist({ songs }) {
    const [selectedTrackIds, setSelectedTrackIds] = useState(new Set())
    const [playlistName, setPlaylistName] = useState('')
    const { refreshPlaylists } = useAuthContext()

    const toggleTrack = (trackId) => {
        setSelectedTrackIds((currentTrackIds) => {
            const nextTrackIds = new Set(currentTrackIds)

            if (nextTrackIds.has(trackId)) {
                nextTrackIds.delete(trackId)
            } else {
                nextTrackIds.add(trackId)
            }

            return nextTrackIds
        })
    }

    const handleCreateNewPlaylist = async (event) => {
        event.preventDefault()
        if (!playlistName?.length) {
            return { message: 'Input name of the playlist' }
        }

        try {
            const response = await createPlaylist({
                name: playlistName,
                trackIds: Array.from(selectedTrackIds)
            }, readSession().token)

            await refreshPlaylists()
            return response
        } catch (error) {
            console.error('HANDLECREATE NEW PLAYLIST ERROR', error)
            return { message: error }
        }
    }

    return (
        <div
            className="music red-scroll-bar space-y-4 bg-[#232323] flex-[2] h-full min-w-[500px] overflow-y-auto  rounded-md
                      relative
                    "
        >
            <div className="create-playlist">
                <form className="create__playlist__form" onSubmit={handleCreateNewPlaylist}>
                    <div className="flex flex-row justify-center items-center gap-5 text-[1.2rem]">
                        <label className="max-[490px]:text-[0.8rem] text-[var(--main-color)]">
                            NAME:
                        </label>
                        <input onChange={(event) => setPlaylistName(event.target.value)} className="name__input bg-black text-[var(--main-color)]" name="name" placeholder="name" type="text" />
                        <button className="max-[490px]:text-[0.8rem] text-[var(--main-color)] cursor-pointer" type="submit">create</button>
                    </div>
                </form>
            </div>
            <div className="songs-to-add flex flex-col justify-center items-center gap-5">
                <span className="text-[var(--main-color)] text-[1.2rem]"> Proposed Songs For you</span>
                {songs.map((song) => (
                    <PlaylistTrackOption
                        isSelected={selectedTrackIds.has(song.song_id)}
                        key={song.song_id}
                        onToggle={toggleTrack}
                        song={song}
                    />
                ))}
            </div>
        </div>
    )
}
