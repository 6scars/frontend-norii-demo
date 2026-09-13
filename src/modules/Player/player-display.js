export function formatPlayerTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'

  const wholeSeconds = Math.floor(value)
  const minutes = Math.floor(wholeSeconds / 60)
  const seconds = wholeSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function getPlayerProgress(currentTime, duration) {
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return 0
  return Math.min(100, Math.max(0, (currentTime / duration) * 100))
}
