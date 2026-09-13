import { useMemo, useState } from 'react'

import { buildLibraryModel } from './library-model.js'

export function useLibrary(playlists) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const [layout, setLayout] = useState('grid')
  const model = useMemo(() => buildLibraryModel(playlists, { query, sort }), [playlists, query, sort])

  return { layout, model, query, setLayout, setQuery, setSort, sort }
}
