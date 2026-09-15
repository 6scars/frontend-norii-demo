export function clampVolume(value: unknown): number {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 0
  return Math.min(1, Math.max(0, numericValue))
}
