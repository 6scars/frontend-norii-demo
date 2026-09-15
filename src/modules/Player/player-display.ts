export function formatPlayerTime(value: unknown): string {
  const seconds = Number(value)
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'

  const wholeSeconds = Math.floor(seconds)
  const minutes = Math.floor(wholeSeconds / 60)
  const remainingSeconds = String(wholeSeconds % 60).padStart(2, '0')
  return `${minutes}:${remainingSeconds}`
}

export function getPlayerProgress(
  currentTime: unknown,
  duration: unknown,
): number {
  const normalizedCurrentTime = Number(currentTime)
  const normalizedDuration = Number(duration)
  if (
    !Number.isFinite(normalizedCurrentTime)
    || !Number.isFinite(normalizedDuration)
    || normalizedDuration <= 0
  ) {
    return 0
  }

  return Math.min(100, Math.max(0, (normalizedCurrentTime / normalizedDuration) * 100))
}
