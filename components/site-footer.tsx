'use client'

import { useEffect, useState } from 'react'

const SOCIAL = [
  { label: 'IMDb', href: 'https://www.imdb.com/name/nm5559286/' },
  { label: 'Instagram', href: 'https://instagram.com/lordkelvon' },
]

const CITIES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
]

/* No rules, no boxes — hierarchy comes from scale and air. A lead statement
   sits against a quiet label/value index; the baseline is just the name,
   the machine-readable link, and a way back up. */
export function SiteFooter({ onReel }: { onReel: () => void }) {
  return (
    <footer className="px-4 pb-10 pt-28 md:px-6 md:pb-12 md:pt-44">
      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <p className="tight max-w-[32ch] text-[20px] leading-[1.22] text-[var(--ink)] md:col-span-7 md:text-[26px] lg:text-[30px]">
          Producer, director, and director of photography. Over a decade
          behind the lens&mdash;authentic stories told with a cinematic eye,
          from Deadliest Catch and Life Below Zero to campaigns and branded
          work.
        </p>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-9 md:col-span-5 md:col-start-8 md:grid-cols-2 md:pt-1.5">
          <Entry label="Based">
            {CITIES.map((c) => (
              <span key={c.tz} className="flex items-baseline justify-between gap-4">
                <span>{c.name}</span>
                <LocalTime tz={c.tz} />
              </span>
            ))}
          </Entry>

          <Entry label="Contact">
            <Link href="mailto:kelvon@kelvonagee.com">kelvon@kelvonagee.com</Link>
            <button
              onClick={onReel}
              className="group inline-flex items-center gap-1.5 text-left text-[var(--ink)] transition-colors hover:text-[var(--ink-dim)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--rec)]" />
              <span className="underline-offset-4 group-hover:underline">
                Watch the reel
              </span>
            </button>
          </Entry>

          <Entry label="Elsewhere">
            {SOCIAL.map(({ label, href }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </Entry>

          <Entry label="Practice">
            <span>Producer · Director · DP</span>
            <span>Since 1986</span>
          </Entry>
        </dl>
      </div>

      <div className="mt-28 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 md:mt-40">
        <span className="tight text-[13px] text-[var(--ink)]">Kelvon Agee</span>
        <div className="readout flex items-baseline gap-6">
          <a
            href="/llms.txt"
            className="transition-colors hover:text-[var(--ink)]"
            title="A plain-text summary of this site for language models"
          >
            llms.txt
          </a>
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                  .matches
                  ? 'auto'
                  : 'smooth',
              })
            }
            className="readout transition-colors hover:text-[var(--ink)]"
          >
            Top &uarr;
          </button>
          <span className="tnum">&copy; {new Date().getFullYear()}</span>
        </div>
      </div>

      <h1 className="sr-only">Kelvon Agee</h1>
    </footer>
  )
}

function Entry({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <dt className="readout">{label}</dt>
      <dd className="tight flex flex-col gap-1 text-[12px] text-[var(--ink)]">
        {children}
      </dd>
    </div>
  )
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="w-fit underline-offset-4 transition-colors hover:text-[var(--ink-dim)] hover:underline"
    >
      {children}
    </a>
  )
}

/* Client-only clock so the server markup never carries a stale time. */
function LocalTime({ tz }: { tz: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: tz,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [tz])

  return (
    <span className="tnum text-[var(--ink-dim)]" aria-label={`Local time, ${tz}`}>
      {time ?? '  :  '}
    </span>
  )
}
