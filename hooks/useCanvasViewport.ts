'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface ViewportApi {
  zoomIn: () => void
  zoomOut: () => void
  fit: (opts?: { animate?: boolean; align?: 'center' | 'top' }) => void
}

const MIN_SCALE = 0.12
const MAX_SCALE = 4
const DRAG_THRESHOLD = 5 // px of movement before a press becomes a pan
const DOT = 28 // dotted-grid spacing in world units

const clamp = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function useCanvasViewport({
  bounds,
  onActivate,
}: {
  bounds: Bounds | null
  onActivate: (index: number, kind: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)

  // Live transform lives in a ref so panning never re-renders React.
  const tf = useRef({ x: 0, y: 0, s: 1 })
  const [zoom, setZoom] = useState(1)
  const [panning, setPanning] = useState(false)
  const zoomRaf = useRef<number | null>(null)
  const tween = useRef<number | null>(null)

  const paint = useCallback(() => {
    const w = worldRef.current
    const c = containerRef.current
    const { x, y, s } = tf.current
    if (w) w.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`
    if (c) {
      // Keep the dotted field locked to the content as it pans and zooms.
      c.style.backgroundSize = `${DOT * s}px ${DOT * s}px`
      c.style.backgroundPosition = `${x}px ${y}px`
    }
  }, [])

  const publishZoom = useCallback(() => {
    if (zoomRaf.current != null) return
    zoomRaf.current = requestAnimationFrame(() => {
      zoomRaf.current = null
      setZoom(tf.current.s)
    })
  }, [])

  const zoomAround = useCallback(
    (cx: number, cy: number, factor: number) => {
      const t = tf.current
      const ns = clamp(t.s * factor)
      const k = ns / t.s
      if (k === 1) return
      t.x = cx - (cx - t.x) * k
      t.y = cy - (cy - t.y) * k
      t.s = ns
      paint()
      publishZoom()
    },
    [paint, publishZoom]
  )

  const animateTo = useCallback(
    (x: number, y: number, s: number, animate = true) => {
      if (tween.current != null) cancelAnimationFrame(tween.current)
      if (!animate) {
        tf.current = { x, y, s }
        paint()
        publishZoom()
        return
      }
      const from = { ...tf.current }
      const start = performance.now()
      const dur = 520
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur)
        const e = easeOutCubic(p)
        tf.current = {
          x: from.x + (x - from.x) * e,
          y: from.y + (y - from.y) * e,
          s: from.s + (s - from.s) * e,
        }
        paint()
        publishZoom()
        if (p < 1) tween.current = requestAnimationFrame(step)
        else tween.current = null
      }
      tween.current = requestAnimationFrame(step)
    },
    [paint, publishZoom]
  )

  const fit = useCallback(
    (opts?: { animate?: boolean; align?: 'center' | 'top' }) => {
      const c = containerRef.current
      if (!c || !bounds) return
      const vw = c.clientWidth
      const vh = c.clientHeight
      const bw = Math.max(1, bounds.maxX - bounds.minX)
      const bh = Math.max(1, bounds.maxY - bounds.minY)
      const align = opts?.align ?? 'center'
      const pad = Math.min(vw, vh) * 0.07 + 20
      const s = clamp(Math.min((vw - pad * 2) / bw, (vh - pad * 2) / bh))
      const x = (vw - bw * s) / 2 - bounds.minX * s
      const y =
        align === 'top'
          ? pad - bounds.minY * s
          : (vh - bh * s) / 2 - bounds.minY * s
      animateTo(x, y, s, opts?.animate !== false)
    },
    [bounds, animateTo]
  )

  const api: ViewportApi = {
    zoomIn: () => {
      const c = containerRef.current
      if (c) zoomAround(c.clientWidth / 2, c.clientHeight / 2, 1.35)
    },
    zoomOut: () => {
      const c = containerRef.current
      if (c) zoomAround(c.clientWidth / 2, c.clientHeight / 2, 1 / 1.35)
    },
    fit: (opts) => fit(opts),
  }

  // Pointer + wheel engine, attached natively so wheel can preventDefault.
  useEffect(() => {
    const c = containerRef.current
    if (!c) return

    const pointers = new Map<number, { x: number; y: number }>()
    let press: { x: number; y: number; index: number; kind: string } | null =
      null
    let dragging = false
    let pinchDist = 0
    let pinchMid = { x: 0, y: 0 }

    const local = (e: PointerEvent | WheelEvent) => {
      const r = c.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { x, y } = local(e)
      if (e.ctrlKey || e.metaKey) {
        // Trackpad pinch / modifier-scroll → zoom toward the cursor.
        zoomAround(x, y, Math.exp(-e.deltaY * 0.01))
      } else {
        // Plain scroll → pan (Figma-style).
        tf.current.x -= e.deltaX
        tf.current.y -= e.deltaY
        paint()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      c.setPointerCapture(e.pointerId)
      const p = local(e)
      pointers.set(e.pointerId, p)
      if (pointers.size === 1) {
        const node = (e.target as HTMLElement).closest<HTMLElement>(
          '[data-node-index]'
        )
        press = {
          x: e.clientX,
          y: e.clientY,
          index: node ? Number(node.dataset.nodeIndex) : -1,
          kind: node?.dataset.nodeKind ?? '',
        }
        dragging = false
      } else if (pointers.size === 2) {
        const pts = [...pointers.values()]
        pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        pinchMid = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        }
        press = null
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      const prev = pointers.get(e.pointerId)!
      const p = local(e)
      pointers.set(e.pointerId, p)

      if (pointers.size >= 2) {
        const pts = [...pointers.values()]
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        const mid = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        }
        if (pinchDist > 0) zoomAround(mid.x, mid.y, dist / pinchDist)
        // Two-finger drag also pans.
        tf.current.x += mid.x - pinchMid.x
        tf.current.y += mid.y - pinchMid.y
        paint()
        pinchDist = dist
        pinchMid = mid
        return
      }

      if (press) {
        if (
          !dragging &&
          Math.hypot(e.clientX - press.x, e.clientY - press.y) > DRAG_THRESHOLD
        ) {
          dragging = true
          setPanning(true)
        }
        if (dragging) {
          tf.current.x += p.x - prev.x
          tf.current.y += p.y - prev.y
          paint()
        }
      }
    }

    const endPointer = (e: PointerEvent) => {
      if (c.hasPointerCapture?.(e.pointerId)) c.releasePointerCapture(e.pointerId)
      pointers.delete(e.pointerId)
      if (pointers.size < 2) pinchDist = 0
      if (press && !dragging && press.kind !== '' && pointers.size === 0) {
        onActivate(press.index, press.kind)
      }
      if (pointers.size === 0) {
        press = null
        dragging = false
        setPanning(false)
      }
    }

    const onDblClick = (e: MouseEvent) => {
      const r = c.getBoundingClientRect()
      zoomAround(e.clientX - r.left, e.clientY - r.top, 1.6)
    }

    c.addEventListener('wheel', onWheel, { passive: false })
    c.addEventListener('pointerdown', onPointerDown)
    c.addEventListener('pointermove', onPointerMove)
    c.addEventListener('pointerup', endPointer)
    c.addEventListener('pointercancel', endPointer)
    c.addEventListener('dblclick', onDblClick)

    return () => {
      c.removeEventListener('wheel', onWheel)
      c.removeEventListener('pointerdown', onPointerDown)
      c.removeEventListener('pointermove', onPointerMove)
      c.removeEventListener('pointerup', endPointer)
      c.removeEventListener('pointercancel', endPointer)
      c.removeEventListener('dblclick', onDblClick)
    }
  }, [onActivate, paint, zoomAround])

  // Keyboard: +/- zoom, 0 fits the board.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === '0') {
          e.preventDefault()
          fit()
        }
        return
      }
      if (e.key === '=' || e.key === '+') api.zoomIn()
      else if (e.key === '-' || e.key === '_') api.zoomOut()
      else if (e.key === '0') fit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit])

  return { containerRef, worldRef, zoom, panning, api, fit }
}
