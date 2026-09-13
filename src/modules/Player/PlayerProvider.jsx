import { PlayerContext } from "./PlayerContext.js";
import { usePlayer } from "./usePlayer.jsx";

export function PlayerProvider({ children }) {
  const player = usePlayer();
  return (
    <PlayerContext.Provider value={player}>
      {children}
    </PlayerContext.Provider>
  );
}
