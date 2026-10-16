'use client'

import { Minus, Plus, Maximize2 } from 'lucide-react'

const CONTROLS: [string, string][] = [
  ['Drag', 'move'],
  ['Scroll', 'pan'],
  ['⌘ Scroll', 'zoom'],
  ['Dbl-click', 'zoom in'],
]

export function CanvasHud({
  zoom,
  count,
  onZoomIn,
  onZoomOut,
  onFit,
  onInfo,
  onReel,
}: {
  zoom: number
  count: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onInfo: () => void
  onReel: () => void
}) {
  return (
    <div className="hud-in pointer-events-none fixed inset-0 z-30 select-none">
      {/* Top-left — standing identity readout */}
      <div className="absolute left-5 top-4 flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
        <span className="readout text-[var(--ink)]">
          Producer / Director / DP
        </span>
      </div>

      {/* Top-right — reel + info */}
      <div className="pointer-events-auto absolute right-5 top-3.5 flex items-center gap-1.5">
        <HudButton onClick={onReel}>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--rec)]" />
          Reel
        </HudButton>
        <HudButton onClick={onInfo}>Info</HudButton>
      </div>

      {/* Bottom-left — the key (desktop gestures; hidden on touch where
          pinch + drag are discoverable) */}
      <div className="absolute bottom-[clamp(5.5rem,13vw,10rem)] left-5 hidden sm:block">
        <div className="mb-2 h-px w-7 bg-[var(--hairline-strong)]" />
        <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1">
          {CONTROLS.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-[11px] tracking-wide text-[var(--ink)]">
                {k}
              </dt>
              <dd className="text-[11px] tracking-wide text-[var(--ink-dim)]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Bottom-right — frame count + zoom controls */}
      <div className="absolute bottom-[clamp(5.5rem,13vw,10rem)] right-5 flex flex-col items-end gap-2.5">
        <span className="readout">
          <span className="tnum text-[var(--ink)]">
            {String(count).padStart(2, '0')}
          </span>{' '}
          frames
        </span>
        <div className="pointer-events-auto flex items-center gap-1">
          <HudButton onClick={onFit} aria-label="Fit to view" square>
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </HudButton>
          <div className="flex items-center overflow-hidden rounded-[2px] border border-[var(--hairline)] bg-[var(--surface)] backdrop-blur">
            <IconBtn onClick={onZoomOut} aria-label="Zoom out">
              <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
            </IconBtn>
            <span className="tnum w-12 text-center text-[11px] text-[var(--ink)]">
              {Math.round(zoom * 100)}%
            </span>
            <IconBtn onClick={onZoomIn} aria-label="Zoom in">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            </IconBtn>
          </div>
        </div>
      </div>

      {/* The wordmark — pinned, full-bleed, the identity the board sits on */}
      <h1 className="font-display pointer-events-none absolute inset-x-0 bottom-0 m-0 text-center font-extrabold uppercase leading-[0.78] tracking-[0.01em] text-[var(--ink)] [font-size:clamp(3rem,15.5vw,15rem)]">
        Kelvon Agee
      </h1>
    </div>
  )
}

function HudButton({
  children,
  onClick,
  square,
  ...rest
}: {
  children: React.ReactNode
  onClick: () => void
  square?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={`flex items-center gap-1.5 rounded-[2px] border border-[var(--hairline)] bg-[var(--surface)] text-[11px] uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur transition-colors hover:border-[var(--hairline-strong)] hover:bg-[var(--ink)]/5 ${
        square ? 'h-[26px] w-[26px] justify-center' : 'h-[26px] px-2.5'
      }`}
    >
      {children}
    </button>
  )
}

function IconBtn({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode
  onClick: () => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className="flex h-[26px] w-7 items-center justify-center text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
    >
      {children}
    </button>
  )
}
