import { useCallback, useState } from 'react'

export function useUIState() {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false)
  const [isCreatePlaylistOpen, setCreatePlaylistOpen] = useState(false)
  const [isTrackDetailsOpen, setTrackDetailsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)

  const toggleAuthDialog = () => setAuthDialogOpen((isOpen) => !isOpen)
  const closeTrackDetails = useCallback(() => setTrackDetailsOpen(false), [])
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
