import { getSongId } from '../Catalog/song.js'

const directionSteps = {
  next: 1,
  previous: -1,
}

export function getAdjacentTrack(queue, currentTrackIndex, direction) {
  if (!Array.isArray(queue) || queue.length === 0) return null

  const step = directionSteps[direction]
  if (!step) throw new Error(`Nieznany kierunek nawigacji: ${direction}`)

  const lastIndex = queue.length - 1
  let index = currentTrackIndex + step

  if (index > lastIndex) index = 0
  if (index < 0) index = lastIndex

  const songId = getSongId(queue[index])
  if (!songId) throw new Error('Utwór docelowy nie ma identyfikatora')

  return { index, songId }
}
