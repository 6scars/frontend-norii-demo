import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { getSongId } from '../../modules/Catalog/song.js'
import { useCurrentPlaybackContext } from '../../modules/CurrentPlayback/useCurrentPlaybackContext.js'
import { useUIStateContext } from '../../modules/UIState/useUIStateContext.js'
import Icon from '../../shared/ui/Icon.jsx'
import Description from './Description.jsx'
import { SHEET_SNAP, useDescriptionSheet } from './hooks/useDescriptionSheet.js'
import './DescriptionDrawer.css'

export default function DescriptionDrawer({ isOpen, compact }) {
  const { currentSong } = useCurrentPlaybackContext()
  const { closeTrackDetails } = useUIStateContext()
  const { pathname } = useLocation()
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const scrollRef = useRef(null)
  const returnFocus = useRef(null)
  const previousPath = useRef(pathname)
  const {
    contentProps,
    handleProps,
    isDragging,
    panelStyle,
    snap,
  } = useDescriptionSheet({ compact, isOpen, panelRef, scrollRef })

  useEffect(() => {
    if (previousPath.current !== pathname) closeTrackDetails()
    previousPath.current = pathname
  }, [closeTrackDetails, pathname])

  useEffect(() => {
    if (!isOpen) return
    returnFocus.current = document.activeElement
    closeRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (event.target.closest?.('[role="dialog"], dialog, .queue-drawer, .show-add-song-container')) return
      event.preventDefault()
      closeTrackDetails()
    }
    document.addEventListener('keydown', onKeyDown)
    const panel = panelRef.current
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (panel?.contains(document.activeElement)) {
        const target = returnFocus.current?.isConnected && !returnFocus.current.closest('[inert]')
          ? returnFocus.current : document.querySelector('.play-left-section .song-image-container')
        target?.focus({ preventScroll: true })
      }
    }
  }, [closeTrackDetails, isOpen])

  const expanded = snap === SHEET_SNAP.expanded
  const drawerClassName = 'description-drawer' + (isOpen ? ' description-drawer--open' : '')
  const backdropClassName = 'description-drawer__backdrop' + (isOpen ? ' description-drawer__backdrop--visible' : '')

  return (
    <>
      {compact ? (
        <button
          aria-hidden={!isOpen}
          aria-label="Zamknij opis utworu"
          className={backdropClassName}
          onClick={closeTrackDetails}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        />
      ) : null}
      <aside
        ref={panelRef}
        id="song-description"
        aria-labelledby="song-description-heading"
        aria-hidden={!isOpen}
        className={drawerClassName}
        data-dragging={isDragging || undefined}
        data-sheet-snap={compact ? snap : undefined}
        inert={!isOpen}
        style={panelStyle}
      >
        <header className="description-drawer__header">
          {compact ? (
            <button
              {...handleProps}
              aria-controls="song-description-content"
              aria-expanded={expanded}
              aria-label={expanded ? 'Zmniejsz opis utworu' : 'Rozwi\u0144 opis utworu'}
              className="description-drawer__handle"
              type="button"
            >
              <span />
            </button>
          ) : null}
          <h2 id="song-description-heading">O utworze</h2>
          <button
            ref={closeRef}
            aria-label="Zamknij opis utworu"
            className="description-close"
            onClick={closeTrackDetails}
            type="button"
          >
            <Icon name={compact ? 'chevronDown' : 'chevronRight'} size={19} />
            {compact ? 'Zamknij' : 'Zwi\u0144'}
          </button>
        </header>
        <div
          {...contentProps}
          id="song-description-content"
          key={getSongId(currentSong)}
          className="description-drawer__scroll"
        >
          {currentSong ? (
            <Description key={getSongId(currentSong)} song={currentSong} onNavigate={closeTrackDetails} />
          ) : null}
        </div>
      </aside>
    </>
  )
}
