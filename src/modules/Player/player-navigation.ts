import { getSongId } from '../Catalog/song.ts'
import type { EntityId, Song } from '../../shared/types/domain.ts'

export type PlaybackDirection = 'next' | 'previous'

const directionSteps: Record<PlaybackDirection, 1 | -1> = {
  next: 1,
  previous: -1,
}

export interface AdjacentTrack {
  index: number
  songId: EntityId
}

export function getAdjacentTrack(
  queue: readonly Song[] | null | undefined,
  currentTrackIndex: number | null,
  direction: PlaybackDirection,
): AdjacentTrack | null {
  if (!queue?.length) return null

  const step = directionSteps[direction]
  if (!step) throw new Error(`Nieznany kierunek nawigacji: ${direction}`)

  const lastIndex = queue.length - 1
  let index = (currentTrackIndex ?? 0) + step

  if (index > lastIndex) index = 0
  if (index < 0) index = lastIndex

  const songId = getSongId(queue[index])
  if (songId === null) throw new Error('Utwór docelowy nie ma identyfikatora')

  return { index, songId }
}

