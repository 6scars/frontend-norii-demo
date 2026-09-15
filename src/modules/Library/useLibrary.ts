import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { Playlist } from '../../shared/types/domain.ts'
import { buildLibraryModel } from './library-model.ts'
import type {
  LibraryModel,
  LibrarySort,
} from './library-model.ts'

export type LibraryLayout = 'grid' | 'list'

export interface LibraryState {
  layout: LibraryLayout
  model: LibraryModel
  query: string
  setLayout: Dispatch<SetStateAction<LibraryLayout>>
  setQuery: Dispatch<SetStateAction<string>>
  setSort: Dispatch<SetStateAction<LibrarySort>>
  sort: LibrarySort
}

export function useLibrary(playlists: readonly Playlist[]): LibraryState {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<LibrarySort>('recent')
  const [layout, setLayout] = useState<LibraryLayout>('grid')
  const model = useMemo(
    () => buildLibraryModel(playlists, { query, sort }),
    [playlists, query, sort],
  )

  return { layout, model, query, setLayout, setQuery, setSort, sort }
}
