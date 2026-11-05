'use client'

const LINKS = [
  { label: 'IMDb', href: 'https://www.imdb.com/name/nm5559286/' },
  { label: 'Instagram', href: 'https://instagram.com/lordkelvon' },
  { label: 'Email', href: 'mailto:kelvon@kelvonagee.com' },
]

export function SiteFooter({ onReel }: { onReel: () => void }) {
  return (
    <footer className="border-t border-[var(--hairline)] px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col gap-10 md:gap-14">
        {/* Lead — the statement carries the footer. */}
        <p className="tight max-w-[60ch] text-[16px] leading-[1.35] text-[var(--ink)] md:text-[19px]">
          Producer, director, and director of photography with over a decade
          behind the lens&mdash;authentic stories told with a cinematic eye, from
          award-nominated documentaries like Deadliest Catch and Life Below Zero
          to campaigns and branded work.
        </p>

        {/* One tight line — meta, links, and the reel, no stacked rows. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[12px] text-[var(--ink-dim)]">
          <span className="tight text-[var(--ink)]">Producer · Director · DP</span>
          <Dot />
          <span>New York / Los Angeles</span>
          <Dot />
          <span>Since 1986</span>

          <span className="mx-1 hidden h-3 w-px bg-[var(--hairline-strong)] sm:inline-block" />

          {LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="text-[var(--ink)] underline-offset-4 transition-colors hover:text-[var(--ink-dim)] hover:underline"
            >
              {label}
            </a>
          ))}

          <button
            onClick={onReel}
            className="group inline-flex items-center gap-1.5 text-[var(--ink)] transition-colors hover:text-[var(--ink-dim)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--rec)]" />
            <span className="underline-offset-4 group-hover:underline">
              Watch the reel
            </span>
          </button>
        </div>

        {/* Baseline — identity + credit on one row. */}
        <div className="flex items-baseline justify-between border-t border-[var(--hairline)] pt-5">
          <span className="tight text-[13px] text-[var(--ink)]">
            Kelvon Agee
          </span>
          <span className="readout">
            website by{' '}
            <a
              href="https://thirdindex.co"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--ink)]"
            >
              Third Index
            </a>
          </span>
        </div>
      </div>

      <h1 className="sr-only">Kelvon Agee</h1>
    </footer>
  )
}

function Dot() {
  return (
    <span
      aria-hidden
      className="inline-block h-[3px] w-[3px] rounded-full bg-[var(--ink-faint)]"
    />
  )
}
