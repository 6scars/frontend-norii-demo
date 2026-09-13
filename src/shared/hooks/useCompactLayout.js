import { useSyncExternalStore } from 'react'

const query = '(width < 768px)'

export function isCompactLayout() {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

function subscribe(onChange) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export function useCompactLayout() {
  return useSyncExternalStore(subscribe, isCompactLayout, () => false)
}
