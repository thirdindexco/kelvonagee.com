'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CloudinaryImage } from '@/components/cloudinary-image'
import { PhotoLightbox } from '@/components/photo-lightbox'
import { ReelPlayer } from '@/components/reel-player'
import { SiteFooter } from '@/components/site-footer'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'

/* Layout per breakpoint. `bleedFrac` is how much of each edge column hangs
   off the viewport (0 = contained). `peek` turns on the hover pull-in. */
interface Cfg {
  cols: number
  gap: number
  bleedFrac: number
  pad: number
  peek: boolean
}

function cfgFor(w: number): Cfg {
  if (w < 640) return { cols: 2, gap: 8, bleedFrac: 0, pad: 8, peek: false }
  if (w < 1024) return { cols: 3, gap: 12, bleedFrac: 0, pad: 16, peek: false }
  if (w < 1536) return { cols: 4, gap: 14, bleedFrac: 0.42, pad: 0, peek: true }
  return { cols: 5, gap: 16, bleedFrac: 0.55, pad: 0, peek: true }
}

const SIZES =
  '(min-width:1536px) 18vw, (min-width:1024px) 23vw, (min-width:640px) 32vw, 48vw'

// Varied aspect ratios (w/h) for the skeleton grid shown before the image
// list has loaded — enough variety that it reads like a real contact sheet.
const PLACEHOLDER_RATIOS = [1.5, 0.78, 1.33, 1, 0.75, 1.6, 0.82, 1.4, 1.2, 0.86]

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v))

export function Gallery() {
  const { images, isLoading, error } = useCloudinaryImages('kelvonagee.com')
  const [vw, setVw] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [reelOpen, setReelOpen] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef<(HTMLDivElement | null)[]>([])
  const peekTarget = useRef(0)
  const reduced = useRef(false)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    onResize()
    reduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cfg = useMemo(() => cfgFor(vw || 1280), [vw])

  // Column widths sized so the two edge columns bleed off by `bleedFrac`.
  const metrics = useMemo(() => {
    const { cols, gap, bleedFrac, pad } = cfg
    const w = vw || 1280
    const colW = bleedFrac
      ? (w - (cols - 1) * gap) / (cols - 2 * bleedFrac)
      : (w - 2 * pad - (cols - 1) * gap) / cols
    const trackW = cols * colW + (cols - 1) * gap
    const marginLeft = (w - trackW) / 2 // negative when the edges bleed
    const maxPeek = bleedFrac ? bleedFrac * colW : 0
    return { colW, trackW, marginLeft, maxPeek }
  }, [cfg, vw])

  // Pack photos into the shortest column — balance depends only on aspect
  // ratio, so it's stable across viewport sizes.
  const columns = useMemo(() => {
    const cols = Array.from({ length: cfg.cols }, () => ({
      items: [] as { img: (typeof images)[number]; index: number }[],
      h: 0,
    }))
    images.forEach((img, index) => {
      let c = 0
      for (let k = 1; k < cols.length; k++) if (cols[k].h < cols[c].h) c = k
      cols[c].items.push({ img, index })
      cols[c].h += img.height / img.width + 0.06
    })
    return cols
  }, [images, cfg.cols])

  // A balanced skeleton grid for the pre-fetch moment — same column widths,
  // just placeholder tiles with varied heights.
  const placeholderColumns = useMemo(() => {
    const cols = Array.from({ length: cfg.cols }, () => ({
      items: [] as number[],
      h: 0,
    }))
    const total = cfg.cols * 5
    for (let i = 0; i < total; i++) {
      const r = PLACEHOLDER_RATIOS[i % PLACEHOLDER_RATIOS.length]
      let c = 0
      for (let k = 1; k < cols.length; k++) if (cols[k].h < cols[c].h) c = k
      cols[c].items.push(r)
      cols[c].h += 1 / r + 0.06
    }
    return cols
  }, [cfg.cols])

  // Per-column lag factors — a deterministic golden-ratio spread so neighbours
  // always differ, which is what reads as inertia "between" the columns.
  const lanes = useMemo(
    () =>
      Array.from(
        { length: cfg.cols },
        (_, i) => 0.04 + (((i + 1) * 0.618034) % 1) * 0.26
      ),
    [cfg.cols]
  )

  // One rAF loop drives both the horizontal hover-peek and the vertical
  // scroll inertia. The columns lag an eased scroll position by lane factor;
  // the gap only exists while actively scrolling, so they realign at rest.
  useEffect(() => {
    if (!vw) return
    let raf = 0
    let smooth = window.scrollY
    let peekCur = 0

    const frame = () => {
      const target = window.scrollY
      smooth += (target - smooth) * 0.12
      const diff = reduced.current ? 0 : clamp(target - smooth, -90, 90)

      peekCur += ((reduced.current ? 0 : peekTarget.current) - peekCur) * 0.08
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${peekCur.toFixed(
          2
        )}px,0,0)`
      }
      for (let i = 0; i < columnRefs.current.length; i++) {
        const el = columnRefs.current[i]
        if (el) {
          el.style.transform = `translate3d(0,${(diff * lanes[i]).toFixed(
            2
          )}px,0)`
        }
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [vw, lanes])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!cfg.peek || e.pointerType === 'touch') {
        peekTarget.current = 0
        return
      }
      const x = clamp(e.clientX / (vw || 1), 0, 1)
      peekTarget.current = (0.5 - x) * 2 * metrics.maxPeek
    },
    [cfg.peek, vw, metrics.maxPeek]
  )

  const onPointerLeave = useCallback(() => {
    peekTarget.current = 0
  }, [])

  const ready = vw > 0 && images.length > 0
  let seen = 0

  return (
    <>
      {/* Minimal top marker — identity lives in the footer. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3.5 mix-blend-difference md:px-6">
        <span className="readout !text-white">
          Kelvon Agee — Producer / Director / DP
        </span>
        <button
          onClick={() => setReelOpen(true)}
          className="readout pointer-events-auto flex items-center gap-1.5 !text-white transition-opacity hover:opacity-70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--rec)]" />
          Reel
        </button>
      </div>

      <main
        ref={viewportRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative min-h-screen pt-14"
        style={{ overflowX: 'clip' }}
      >
        {ready ? (
          <div
            ref={trackRef}
            className="flex items-start will-change-transform"
            style={{
              width: metrics.trackW,
              marginLeft: metrics.marginLeft,
              gap: cfg.gap,
            }}
          >
            {columns.map((col, ci) => (
              <div
                key={ci}
                style={{ width: metrics.colW }}
                className="shrink-0"
              >
                <div
                  ref={(el) => {
                    columnRefs.current[ci] = el
                  }}
                  className="flex flex-col will-change-transform"
                  style={{ gap: cfg.gap }}
                >
                  {col.items.map(({ img, index }) => {
                    const delay = Math.min(seen++ * 0.015, 0.5)
                    return (
                      <button
                        key={img.public_id}
                        onClick={() => setLightbox(index)}
                        aria-label="Open photo"
                        className="frame-in group relative block w-full overflow-hidden"
                        style={{
                          aspectRatio: `${img.width} / ${img.height}`,
                          animationDelay: `${delay}s`,
                        }}
                      >
                        <CloudinaryImage
                          publicId={img.public_id}
                          alt=""
                          width={img.width}
                          height={img.height}
                          sizes={SIZES}
                          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-[60vh] items-center justify-center">
            <span className="readout">Couldn&rsquo;t load frames — {error}</span>
          </div>
        ) : vw > 0 ? (
          <div
            className="flex items-start"
            style={{
              width: metrics.trackW,
              marginLeft: metrics.marginLeft,
              gap: cfg.gap,
            }}
            aria-hidden
          >
            {placeholderColumns.map((col, ci) => (
              <div
                key={ci}
                style={{ width: metrics.colW }}
                className="shrink-0"
              >
                <div className="flex flex-col" style={{ gap: cfg.gap }}>
                  {col.items.map((r, i) => (
                    <div
                      key={i}
                      className="frame-in skeleton relative w-full overflow-hidden"
                      style={{
                        aspectRatio: `${r}`,
                        animationDelay: `${Math.min((ci * 5 + i) * 0.02, 0.5)}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <SiteFooter onReel={() => setReelOpen(true)} />
      </main>

      <ReelPlayer open={reelOpen} onClose={() => setReelOpen(false)} />
      <PhotoLightbox
        images={images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </>
  )
}
