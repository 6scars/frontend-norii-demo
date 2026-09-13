import { useContext } from "react";
import { PlayerContext } from "./PlayerContext.js";

export function usePlayerContext() {
  return useContext(PlayerContext);
}
