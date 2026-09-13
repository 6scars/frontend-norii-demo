import PlayCenterSection from "./PlayCenterSection.jsx";
import PlayRightSection from "./PlayRightSection.jsx";
import PlayLeftSection from "./PlayLeftSection.jsx";
import "./Play.css";
import { usePlayerContext } from "../../modules/Player/usePlayerContext.js";
import { useCurrentPlaybackContext } from "../../modules/CurrentPlayback/useCurrentPlaybackContext.js";
import { getPlayerProgress } from "../../modules/Player/player-display.js";

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
