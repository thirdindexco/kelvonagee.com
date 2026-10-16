'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { CloudinaryImage } from '@/components/cloudinary-image'
import { PhotoLightbox } from '@/components/photo-lightbox'
import { InfoPanel } from '@/components/info-panel'
import { ReelPlayer } from '@/components/reel-player'
import { CanvasHud } from '@/components/canvas-hud'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { useCanvasViewport } from '@/hooks/useCanvasViewport'
import { layoutNodes } from '@/lib/layout'

function columnsFor(width: number) {
  if (width < 560) return 3
  if (width < 900) return 4
  if (width < 1280) return 6
  return 7
}

export function CanvasBoard() {
  const { images, isLoading, error } = useCloudinaryImages('kelvonagee.com')
  const [cols, setCols] = useState(7)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [reelOpen, setReelOpen] = useState(false)
  const didFit = useRef(false)

  useEffect(() => {
    const update = () => setCols(columnsFor(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const { nodes, bounds } = useMemo(
    () => layoutNodes(images, cols),
    [images, cols]
  )

  const onActivate = useCallback(
    (index: number, kind: string) => {
      if (kind === 'reel') setReelOpen(true)
      else if (index >= 0) setLightbox(index)
    },
    []
  )

  const { containerRef, worldRef, zoom, panning, fit, api } = useCanvasViewport({
    bounds: images.length ? bounds : null,
    onActivate,
  })

  // Fit the board once, top-aligned, as soon as it has real dimensions.
  useEffect(() => {
    if (didFit.current || !images.length) return
    didFit.current = true
    requestAnimationFrame(() => fit({ animate: false, align: 'top' }))
  }, [images.length, fit])

  // Keep the board framed on resize (no animation — it tracks the layout).
  useEffect(() => {
    if (!didFit.current) return
    fit({ animate: false, align: 'top' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols])

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div
        ref={containerRef}
        className="canvas-surface absolute inset-0 touch-none"
        style={{ cursor: panning ? 'grabbing' : 'grab' }}
      >
        <div
          ref={worldRef}
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{ width: 0, height: 0 }}
        >
          {nodes.map((node) =>
            node.kind === 'reel' ? (
              <ReelNode
                key={node.id}
                x={node.x}
                y={node.y}
                w={node.w}
                h={node.h}
              />
            ) : (
              <div
                key={node.id}
                data-node-index={node.index}
                data-node-kind="photo"
                className="node-in absolute overflow-hidden bg-white/[0.03]"
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.w,
                  height: node.h,
                  animationDelay: `${Math.min(node.index * 0.012, 0.5)}s`,
                }}
              >
                <CloudinaryImage
                  alt=""
                  publicId={node.image!.public_id}
                  width={node.w}
                  height={node.h}
                  sizes={`${node.w}px`}
                  className="h-full w-full object-cover"
                />
              </div>
            )
          )}
        </div>
      </div>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="readout animate-pulse">Loading frames…</span>
        </div>
      )}
      {error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="readout">Couldn&rsquo;t load frames — {error}</span>
        </div>
      )}

      <CanvasHud
        zoom={zoom}
        count={images.length}
        onZoomIn={api.zoomIn}
        onZoomOut={api.zoomOut}
        onFit={() => fit({ align: 'top' })}
        onInfo={() => setInfoOpen(true)}
        onReel={() => setReelOpen(true)}
      />

      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} />
      <ReelPlayer open={reelOpen} onClose={() => setReelOpen(false)} />
      <PhotoLightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </main>
  )
}

const REEL_POSTER =
  '//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1200,q_auto/nfreyhnd41z7lzuwddas_vtvhfh'

function ReelNode({
  x,
  y,
  w,
  h,
}: {
  x: number
  y: number
  w: number
  h: number
}) {
  return (
    <div
      data-node-index={-1}
      data-node-kind="reel"
      className="node-in group absolute overflow-hidden border border-[var(--hairline-strong)] bg-cover bg-center"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundImage: `url(https:${REEL_POSTER})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/15" />
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--rec)]" />
        <span className="readout text-[var(--ink)]">Reel</span>
      </div>
      <div className="absolute bottom-3 right-3">
        <span className="readout tnum text-[var(--ink)]">03:08</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--ink)]/60 bg-black/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5 fill-[var(--ink)] text-[var(--ink)]" />
        </span>
      </div>
    </div>
  )
}
