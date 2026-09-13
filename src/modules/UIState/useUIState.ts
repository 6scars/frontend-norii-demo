import { useCallback, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export interface UIStateContextValue {
  closeTrackDetails: () => void
  isAuthDialogOpen: boolean
  isCreatePlaylistOpen: boolean
  isTrackDetailsOpen: boolean
  openTrackDetails: () => void
  queueOpen: boolean
  setAuthDialogOpen: Dispatch<SetStateAction<boolean>>
  setCreatePlaylistOpen: Dispatch<SetStateAction<boolean>>
  setQueueOpen: Dispatch<SetStateAction<boolean>>
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarOpen: boolean
  toggleAuthDialog: () => void
}

export function useUIState(): UIStateContextValue {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false)
  const [isCreatePlaylistOpen, setCreatePlaylistOpen] = useState(false)
  const [isTrackDetailsOpen, setTrackDetailsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)

  const toggleAuthDialog = (): void =>
    setAuthDialogOpen((isOpen) => !isOpen)
  const closeTrackDetails = useCallback(
    () => setTrackDetailsOpen(false),
    [],
  )
  const openTrackDetails = useCallback(() => {
    setQueueOpen(false)
    setTrackDetailsOpen(true)
  }, [])

  return {
    closeTrackDetails,
    isAuthDialogOpen,
    isCreatePlaylistOpen,
    isTrackDetailsOpen,
    openTrackDetails,
    queueOpen,
    setAuthDialogOpen,
    setCreatePlaylistOpen,
    setQueueOpen,
    setSidebarOpen,
    sidebarOpen,
    toggleAuthDialog,
  }
}
