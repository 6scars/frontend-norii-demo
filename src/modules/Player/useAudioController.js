import { useCallback, useRef, useState } from 'react'

import { clampVolume } from './player-audio.js'

export function useAudioController({ onEnded }) {
  const audioRef = useRef(null)
  const currentTimeRef = useRef(0)
  const [currentTime, setCurrentTimeState] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)

  const setCurrentTime = useCallback((value) => {
    const nextTime = Number(typeof value === 'function' ? value(currentTimeRef.current) : value)
    if (!Number.isFinite(nextTime)) return

    currentTimeRef.current = nextTime
    setCurrentTimeState(nextTime)
    if (audioRef.current) audioRef.current.currentTime = nextTime
  }, [])

  const setAudioVolume = useCallback((value) => {
    const audio = audioRef.current
    if (!audio) return

    const nextVolume = clampVolume(Number(value))
    audio.volume = nextVolume
    setVolume(nextVolume)
  }, [])

  const toggleLoop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = !audio.loop
    setLoop(audio.loop)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setMuted(audio.muted)
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) audio.play().catch(() => setIsPlaying(false))
    else audio.pause()
  }, [])

  const audioEvents = {
    onEnded: () => Promise.resolve(onEnded()).catch((error) => console.error('Player navigation error', error)),
    onLoadedData: (event) => {
      const audio = event.currentTarget
      setIsPlaying(true)
      audio.play().catch(() => {
        if (audioRef.current === audio) setIsPlaying(false)
      })
    },
    onLoadedMetadata: (event) => setDuration(event.currentTarget.duration || 0),
    onPause: () => setIsPlaying(false),
    onPlay: () => setIsPlaying(true),
    onTimeUpdate: (event) => {
      currentTimeRef.current = event.currentTarget.currentTime
      setCurrentTimeState(event.currentTarget.currentTime)
    },
    onVolumeChange: (event) => {
      setMuted(event.currentTarget.muted)
      setVolume(event.currentTarget.volume)
    },
  }

  return {
    audioEvents,
    audioRef,
    currentTime,
    duration,
    isPlaying,
    loop,
    muted,
    setAudioVolume,
    setCurrentTime,
    toggleLoop,
    toggleMute,
    togglePlay,
    volume,
  }
}
