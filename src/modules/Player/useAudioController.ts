import { useCallback, useRef, useState } from 'react'
import type {
  RefObject,
  SyntheticEvent,
} from 'react'

import { clampVolume } from './player-audio.ts'

type NumericStateUpdate = number | ((currentValue: number) => number)

interface AudioControllerOptions {
  onEnded: () => unknown
}

export interface AudioController {
  audioEvents: {
    onEnded: () => void
    onLoadedData: (event: SyntheticEvent<HTMLAudioElement>) => void
    onLoadedMetadata: (event: SyntheticEvent<HTMLAudioElement>) => void
    onPause: () => void
    onPlay: () => void
    onTimeUpdate: (event: SyntheticEvent<HTMLAudioElement>) => void
    onVolumeChange: (event: SyntheticEvent<HTMLAudioElement>) => void
  }
  audioRef: RefObject<HTMLAudioElement | null>
  currentTime: number
  duration: number
  isPlaying: boolean
  loop: boolean
  muted: boolean
  setAudioVolume: (value: unknown) => void
  setCurrentTime: (value: NumericStateUpdate) => void
  toggleLoop: () => void
  toggleMute: () => void
  togglePlay: () => void
  volume: number
}

export function useAudioController({
  onEnded,
}: AudioControllerOptions): AudioController {
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTimeRef = useRef(0)
  const [currentTime, setCurrentTimeState] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)

  const setCurrentTime = useCallback((value: NumericStateUpdate): void => {
    const nextTime = Number(
      typeof value === 'function' ? value(currentTimeRef.current) : value,
    )
    if (!Number.isFinite(nextTime)) return

    currentTimeRef.current = nextTime
    setCurrentTimeState(nextTime)
    if (audioRef.current) audioRef.current.currentTime = nextTime
  }, [])

  const setAudioVolume = useCallback((value: unknown): void => {
    const audio = audioRef.current
    if (!audio) return

    const nextVolume = clampVolume(value)
    audio.volume = nextVolume
    setVolume(nextVolume)
  }, [])

  const toggleLoop = useCallback((): void => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = !audio.loop
    setLoop(audio.loop)
  }, [])

  const toggleMute = useCallback((): void => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !audio.muted
    setMuted(audio.muted)
  }, [])

  const togglePlay = useCallback((): void => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [])

  const audioEvents = {
    onEnded: (): void => {
      void Promise.resolve(onEnded()).catch((error: unknown) => {
        console.error('Player navigation error', error)
      })
    },
    onLoadedData: (event: SyntheticEvent<HTMLAudioElement>): void => {
      const audio = event.currentTarget
      setIsPlaying(true)
      void audio.play().catch(() => {
        if (audioRef.current === audio) setIsPlaying(false)
      })
    },
    onLoadedMetadata: (event: SyntheticEvent<HTMLAudioElement>): void =>
      setDuration(event.currentTarget.duration || 0),
    onPause: (): void => setIsPlaying(false),
    onPlay: (): void => setIsPlaying(true),
    onTimeUpdate: (event: SyntheticEvent<HTMLAudioElement>): void => {
      currentTimeRef.current = event.currentTarget.currentTime
      setCurrentTimeState(event.currentTarget.currentTime)
    },
    onVolumeChange: (event: SyntheticEvent<HTMLAudioElement>): void => {
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
