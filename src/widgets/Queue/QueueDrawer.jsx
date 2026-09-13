import { useEffect, useId, useRef } from 'react'

import { usePlaybackQueue } from '../../modules/Player/usePlaybackQueue.js'
import { formatQueueCount } from '../../modules/Player/playback-queue.js'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.js'
import Icon from '../../shared/ui/Icon.jsx'
import QueuePanel from './QueuePanel.jsx'
import './QueueDrawer.css'

export default function QueueDrawer() {
  const triggerRef = useRef(null)
  const wasOpen = useRef(false)
  const panelId = useId()
  const playback = usePlaybackQueue()
  const { closeTrackDetails, isTrackDetailsOpen, queueOpen, setQueueOpen, setSidebarOpen } = useUIStateContext()

  useEffect(() => {
    if (isTrackDetailsOpen) {
      wasOpen.current = false
      return
    }
    if (!queueOpen) {
      if (wasOpen.current) triggerRef.current?.focus({ preventScroll: true })
      wasOpen.current = false
      return
    }
    wasOpen.current = true
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (event.target.closest?.('[role="dialog"], dialog')) return
      event.preventDefault()
      setQueueOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isTrackDetailsOpen, queueOpen, setQueueOpen])

  const toggleQueue = () => {
    const nextOpen = !queueOpen
    setQueueOpen(nextOpen)
    if (nextOpen) {
      closeTrackDetails()
      setSidebarOpen(false)
    }
  }

  return (
    <div className={`queue-drawer ${queueOpen ? 'queue-drawer--open' : ''} ${isTrackDetailsOpen ? 'queue-drawer--details-open' : ''}`}>
      <button
        ref={triggerRef}
        className="queue-drawer__trigger"
        aria-label={`${queueOpen ? 'Zwiń' : 'Otwórz'} kolejkę — ${formatQueueCount(playback.queue.length)}`}
        aria-expanded={queueOpen}
        aria-controls={panelId}
        onClick={toggleQueue}
        type="button"
      >
        <Icon name="queue" size={24} />
      </button>
      <div id={panelId} className="queue-drawer__surface" inert={!queueOpen} aria-hidden={!queueOpen}>
        <QueuePanel playback={playback} onClose={() => setQueueOpen(false)} />
      </div>
    </div>
  )
}
