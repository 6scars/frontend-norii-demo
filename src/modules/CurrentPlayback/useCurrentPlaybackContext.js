import { useContext } from "react";
import { CurrentPlaybackContext } from "./CurrentPlaybackContext.js";

export function useCurrentPlaybackContext(){
    return useContext(CurrentPlaybackContext)
}
