import { getSongId } from '../Catalog/song.js'

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
]

export function buildRadioModel(songs) {
  const catalog = Array.isArray(songs)
    ? songs.filter((song) => getSongId(song) !== null && Boolean(song?.song_name))
    : []

  if (!catalog.length) return { stations: [], total: 0 }

  const byViews = (direction) => [...catalog].sort((left, right) => {
    const leftViews = Number(left.views) || 0
    const rightViews = Number(right.views) || 0
    return direction * (rightViews - leftViews)
  })
  const queues = {
    catalog: [...catalog],
    popular: byViews(1),
    hidden: byViews(-1),
  }

  return {
    stations: stationDefinitions.map((station) => ({ ...station, tracks: queues[station.id] })),
    total: catalog.length,
  }
}
