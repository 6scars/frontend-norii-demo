import { CurrentPlaybackContext } from "./CurrentPlaybackContext.js";
import { useCurrentPlaybackState } from './useCurrentPlaybackState.js'

export function CurrentPlaybackProvider({ children }) {
    const playbackState = useCurrentPlaybackState()
    return (
        <CurrentPlaybackContext.Provider value={playbackState}>
            {children}
        </CurrentPlaybackContext.Provider>
    )
}
