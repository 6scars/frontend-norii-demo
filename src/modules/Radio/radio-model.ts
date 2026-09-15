import { getSongId } from '../Catalog/song.ts'
import type { Song } from '../../shared/types/domain.ts'

const stationDefinitions = [
  {
    id: 'catalog',
    title: 'Radio katalogu',
    description: 'Wszystkie dostępne utwory w jednej kolejce.',
  },
  {
    id: 'popular',
    title: 'Najczęściej słuchane',
    description: 'Zacznij od utworów z największą liczbą odsłuchań.',
  },
  {
    id: 'hidden',
    title: 'Mniej odkryte',
    description: 'Najpierw nagrania, które dopiero czekają na uwagę.',
  },
] as const

export type RadioStationId = (typeof stationDefinitions)[number]['id']

export interface RadioStation {
  id: RadioStationId
  title: string
  description: string
  tracks: Song[]
}

export interface RadioModel {
  stations: RadioStation[]
  total: number
}

export function buildRadioModel(
  songs: readonly (Song | null | undefined)[] | null | undefined,
): RadioModel {
  const catalog = songs ? songs.filter(
        (song): song is Song =>
          song != null
          && getSongId(song) !== null
          && Boolean(song.song_name),
      )
    : []

  if (!catalog.length) return { stations: [], total: 0 }

  const byViews = (direction: 1 | -1): Song[] =>
    [...catalog].sort((left, right) => {
      const leftViews = Number(left.views) || 0
      const rightViews = Number(right.views) || 0
      return direction * (rightViews - leftViews)
    })
  const queues: Record<RadioStationId, Song[]> = {
    catalog: [...catalog],
    popular: byViews(1),
    hidden: byViews(-1),
  }

  return {
    stations: stationDefinitions.map((station) => ({
      ...station,
      tracks: queues[station.id],
    })),
    total: catalog.length,
  }
}


