import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { Song } from '../../shared/types/domain.ts'
import { buildDiscoveryModel } from './discovery-model.ts'
import type { DiscoveryModel } from './discovery-model.ts'

export type DiscoverySection = 'recommended' | 'tracks' | 'artists'

export interface DiscoveryState {
  model: DiscoveryModel
  query: string
  section: DiscoverySection
  setQuery: Dispatch<SetStateAction<string>>
  setSection: Dispatch<SetStateAction<DiscoverySection>>
}

export function useDiscovery(songs: readonly Song[]): DiscoveryState {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<DiscoverySection>('recommended')
  const model = useMemo(
    () => buildDiscoveryModel(songs, query),
    [songs, query],
  )

  return { model, query, section, setQuery, setSection }
}
