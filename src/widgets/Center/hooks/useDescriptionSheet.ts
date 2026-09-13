import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  CSSProperties,
  PointerEvent,
  RefObject,
  TouchEvent,
  UIEvent,
  WheelEvent,
} from 'react'

export const SHEET_SNAP = Object.freeze({
  collapsed: 'collapsed',
  expanded: 'expanded',
} as const)

export type SheetSnap = (typeof SHEET_SNAP)[keyof typeof SHEET_SNAP]

const COLLAPSED_VIEWPORT_RATIO = 0.36
const EXPANDED_VIEWPORT_RATIO = 0.76
const SWIPE_VELOCITY_THRESHOLD = 0.35

interface SheetSnapInput {
  height: number
  minHeight: number
  maxHeight: number
  velocityY?: number
}

interface SheetDragState {
  initialHeight: number
  lastTime: number
  lastY: number
  maxHeight: number
  minHeight: number
  moved: boolean
  startY: number
  velocityY: number
}

interface DescriptionSheetOptions {
  compact: boolean
  isOpen: boolean
  panelRef: RefObject<HTMLElement | null>
  scrollRef: RefObject<HTMLDivElement | null>
}

type SheetPanelStyle = CSSProperties & {
  '--description-sheet-drag-height': string
}

export function clampSheetHeight(
  height: number,
  minHeight: number,
  maxHeight: number,
): number {
  return Math.min(maxHeight, Math.max(minHeight, height))
}

export function resolveSheetSnap({
  height,
  minHeight,
  maxHeight,
  velocityY = 0,
}: SheetSnapInput): SheetSnap {
  if (velocityY <= -SWIPE_VELOCITY_THRESHOLD) return SHEET_SNAP.expanded
  if (velocityY >= SWIPE_VELOCITY_THRESHOLD) return SHEET_SNAP.collapsed

  return height < (minHeight + maxHeight) / 2
    ? SHEET_SNAP.collapsed
    : SHEET_SNAP.expanded
}

function getSheetLimits(): { minHeight: number; maxHeight: number } {
  return {
    minHeight: window.innerHeight * COLLAPSED_VIEWPORT_RATIO,
    maxHeight: window.innerHeight * EXPANDED_VIEWPORT_RATIO,
  }
}

export function useDescriptionSheet({
  compact,
  isOpen,
  panelRef,
  scrollRef,
}: DescriptionSheetOptions) {
  const [snap, setSnap] = useState<SheetSnap>(SHEET_SNAP.collapsed)
  const [dragHeight, setDragHeight] = useState<number | null>(null)
  const dragState = useRef<SheetDragState | null>(null)
  const suppressNextClick = useRef(false)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen || !compact) {
      setSnap(SHEET_SNAP.collapsed)
      setDragHeight(null)
      dragState.current = null
      touchStartY.current = null
    }
  }, [compact, isOpen])

  const expand = useCallback((): void => {
    if (compact && isOpen) setSnap(SHEET_SNAP.expanded)
  }, [compact, isOpen])

  const toggleSnap = useCallback((): void => {
    setSnap((currentSnap) =>
      currentSnap === SHEET_SNAP.collapsed
        ? SHEET_SNAP.expanded
        : SHEET_SNAP.collapsed,
    )
  }, [])

  const onHandlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>): void => {
      if (!compact || !isOpen || event.button !== 0) return

      const { minHeight, maxHeight } = getSheetLimits()
      const initialHeight =
        panelRef.current?.getBoundingClientRect().height
        ?? (snap === SHEET_SNAP.expanded ? maxHeight : minHeight)

      suppressNextClick.current = false
      dragState.current = {
        initialHeight,
        lastTime: performance.now(),
        lastY: event.clientY,
        maxHeight,
        minHeight,
        moved: false,
        startY: event.clientY,
        velocityY: 0,
      }
      event.currentTarget.setPointerCapture?.(event.pointerId)
    },
    [compact, isOpen, panelRef, snap],
  )

  const onHandlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>): void => {
      const drag = dragState.current
      if (!drag) return

      const now = performance.now()
      const elapsed = Math.max(1, now - drag.lastTime)
      const nextHeight = clampSheetHeight(
        drag.initialHeight + drag.startY - event.clientY,
        drag.minHeight,
        drag.maxHeight,
      )

      drag.velocityY = (event.clientY - drag.lastY) / elapsed
      drag.lastY = event.clientY
      drag.lastTime = now
      drag.moved ||= Math.abs(event.clientY - drag.startY) > 4
      setDragHeight(nextHeight)
    },
    [],
  )

  const finishDrag = useCallback(
    (event: PointerEvent<HTMLButtonElement>): void => {
      const drag = dragState.current
      if (!drag) return

      const height =
        panelRef.current?.getBoundingClientRect().height
        ?? drag.initialHeight
      suppressNextClick.current = drag.moved
      setSnap(resolveSheetSnap({
        height,
        maxHeight: drag.maxHeight,
        minHeight: drag.minHeight,
        velocityY: drag.velocityY,
      }))
      setDragHeight(null)
      dragState.current = null
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    },
    [panelRef],
  )

  const onHandleClick = useCallback((): void => {
    if (suppressNextClick.current) {
      suppressNextClick.current = false
      return
    }
    toggleSnap()
  }, [toggleSnap])

  const onContentScroll = useCallback(
    (event: UIEvent<HTMLDivElement>): void => {
      if (
        compact
        && snap === SHEET_SNAP.collapsed
        && event.currentTarget.scrollTop > 0
      ) {
        event.currentTarget.scrollTop = 0
        expand()
      }
    },
    [compact, expand, snap],
  )

  const onContentWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>): void => {
      if (
        compact
        && snap === SHEET_SNAP.collapsed
        && event.deltaY > 0
      ) {
        event.preventDefault()
        expand()
      }
    },
    [compact, expand, snap],
  )

  const onContentTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>): void => {
      touchStartY.current = event.touches[0]?.clientY ?? null
    },
    [],
  )

  const onContentTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>): void => {
      const startY = touchStartY.current
      const currentY = event.touches[0]?.clientY
      if (
        compact
        && snap === SHEET_SNAP.collapsed
        && startY !== null
        && currentY !== undefined
        && startY - currentY > 8
      ) {
        touchStartY.current = null
        expand()
      }
    },
    [compact, expand, snap],
  )

  const panelStyle: SheetPanelStyle | undefined = dragHeight === null
    ? undefined
    : { '--description-sheet-drag-height': `${dragHeight}px` }

  return {
    contentProps: {
      onScroll: onContentScroll,
      onTouchMove: onContentTouchMove,
      onTouchStart: onContentTouchStart,
      onWheel: onContentWheel,
      ref: scrollRef,
    },
    handleProps: {
      onClick: onHandleClick,
      onPointerCancel: finishDrag,
      onPointerDown: onHandlePointerDown,
      onPointerMove: onHandlePointerMove,
      onPointerUp: finishDrag,
    },
    isDragging: dragHeight !== null,
    panelStyle,
    snap,
    toggleSnap,
  }
}
