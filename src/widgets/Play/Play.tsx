import PlayCenterSection from "./PlayCenterSection.tsx";
import PlayRightSection from "./PlayRightSection.tsx";
import PlayLeftSection from "./PlayLeftSection.tsx";
import "./Play.css";
import { usePlayerContext } from "../../modules/Player/usePlayerContext.ts";
import { useCurrentPlaybackContext } from "../../modules/CurrentPlayback/useCurrentPlaybackContext.ts";
import { getPlayerProgress } from "../../modules/Player/player-display.ts";

export default function Play() {
  const {
    audioEvents,
    audioRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    muted,
    loop,
    setCurrentTime,
    togglePlay,
    setAudioVolume,
    toggleMute,
    toggleLoop,
    goToNext,
    goToPrevious
  } = usePlayerContext();

  const { currentSong } = useCurrentPlaybackContext();
  const progressBar = getPlayerProgress(currentTime, duration);

  if (!currentSong) return null;

  return (
    <div
      className="play"
    >
      <PlayLeftSection
        currentSong={currentSong}
      />

      <PlayCenterSection
        audioEvents={audioEvents}
        setCurrentTime={setCurrentTime}
        audioRef={audioRef}
        handlePlay={togglePlay}
        play={isPlaying}
        duration={duration}
        current={currentTime}
        progressBar={progressBar}
        loop={loop}
        handleLoop={toggleLoop}
        currentSong={currentSong}
        goToNextSong={goToNext}
        goToPreviousSong={goToPrevious}
      />

      <PlayRightSection
        volume={volume}
        handleVolume={setAudioVolume}
        muted={muted}
        handleMute={toggleMute}
      />
    </div>
  );
}
