import { getSongId } from '../Catalog/song.js'

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('pl')

export function buildDiscoveryModel(songsValue, queryValue) {
  const catalog = Array.isArray(songsValue)
    ? songsValue.filter((song) => getSongId(song) !== null && song?.song_name && song?.author)
    : []
  const query = normalize(queryValue)
  const tracks = query
    ? catalog.filter((song) => normalize(`${song.song_name} ${song.author} ${song.album_name ?? ''}`).includes(query))
    : [...catalog]
  const artistsByName = new Map()

  for (const song of tracks) {
    const key = normalize(song.author)
    if (!artistsByName.has(key)) artistsByName.set(key, { name: song.author, song })
  }

  return {
    featured: catalog[0] ?? null,
    tracks,
    artists: [...artistsByName.values()],
  }
}
