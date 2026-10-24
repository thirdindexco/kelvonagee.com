'use client'

import { Minus, Plus, Maximize2 } from 'lucide-react'

const CONTROLS: [string, string][] = [
  ['Drag', 'move'],
  ['Scroll', 'pan'],
  ['⌘ Scroll', 'zoom'],
]

export function CanvasHud({
  zoom,
  onZoomIn,
  onZoomOut,
  onFit,
  onInfo,
  onReel,
}: {
  zoom: number
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

      {/* Bottom-left — a quiet gesture legend (desktop only; pinch + drag are
          discoverable on touch) */}
      <div className="absolute bottom-3 left-5 hidden opacity-55 sm:block">
        <dl className="grid grid-cols-[auto_auto] gap-x-2.5 gap-y-0.5">
          {CONTROLS.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-[10px] tracking-wide text-[var(--ink-dim)]">
                {k}
              </dt>
              <dd className="text-[10px] tracking-wide text-[var(--ink-faint)]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Bottom-right — compact zoom controls, on the baseline */}
      <div className="absolute bottom-3 right-5 flex items-center gap-2.5">
        <div className="pointer-events-auto flex items-center gap-1">
          <button
            onClick={onFit}
            aria-label="Fit to view"
            className="flex h-[20px] w-[20px] items-center justify-center rounded-[2px] border border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink)] backdrop-blur transition-colors hover:border-[var(--hairline-strong)] hover:bg-[var(--ink)]/5"
          >
            <Maximize2 className="h-3 w-3" strokeWidth={1.75} />
          </button>
          <div className="flex h-[20px] items-center overflow-hidden rounded-[2px] border border-[var(--hairline)] bg-[var(--surface)] backdrop-blur">
            <IconBtn onClick={onZoomOut} aria-label="Zoom out">
              <Minus className="h-3 w-3" strokeWidth={1.75} />
            </IconBtn>
            <span className="tnum w-9 text-center text-[10px] text-[var(--ink)]">
              {Math.round(zoom * 100)}%
            </span>
            <IconBtn onClick={onZoomIn} aria-label="Zoom in">
              <Plus className="h-3 w-3" strokeWidth={1.75} />
            </IconBtn>
          </div>
        </div>
      </div>

      {/* The wordmark — the logo.svg, pinned full-bleed to the bottom. Drawn as
          a mask so it takes the warm --ink color on the dark field. */}
      <h1 className="pointer-events-none absolute inset-x-0 bottom-0 m-0 px-4 md:px-6">
        <span className="sr-only">Kelvon Agee</span>
        <span
          aria-hidden
          className="block w-full"
          style={{
            height: 'clamp(2.25rem, 13vw, 10rem)',
            backgroundColor: 'var(--ink)',
            WebkitMaskImage: 'url(/logo.svg)',
            maskImage: 'url(/logo.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center bottom',
            maskPosition: 'center bottom',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
        />
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
      className="flex h-full w-5 items-center justify-center text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
    >
      {children}
    </button>
  )
}
