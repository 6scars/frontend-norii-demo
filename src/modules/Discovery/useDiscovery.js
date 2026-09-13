import { useMemo, useState } from 'react'

import { buildDiscoveryModel } from './discovery-model.js'

export function useDiscovery(songs) {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState('recommended')
  const model = useMemo(() => buildDiscoveryModel(songs, query), [songs, query])

  return { model, query, section, setQuery, setSection }
}
