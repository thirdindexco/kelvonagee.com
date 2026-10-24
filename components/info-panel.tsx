'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

const LINKS = [
  { label: 'IMDb', href: 'https://www.imdb.com/name/nm5559286/' },
  { label: 'Instagram', href: 'https://instagram.com/lordkelvon' },
  { label: 'kelvon@kelvonagee.com', href: 'mailto:kelvon@kelvonagee.com' },
]

const FIELDS = [
  ['Roles', 'Producer · Director · DP'],
  ['Based', 'New York / Los Angeles'],
  ['Since', '1986'],
]

export function InfoPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
            className="scroll-thin fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col overflow-y-auto border-l border-[var(--hairline)] bg-[var(--surface)] backdrop-blur-xl"
            role="dialog"
            aria-label="About Kelvon Agee"
          >
            <header className="flex items-center justify-between border-b border-[var(--hairline)] px-6 py-4">
              <span className="readout text-[var(--ink)]">Info</span>
              <button
                onClick={onClose}
                aria-label="Close info"
                className="text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex flex-1 flex-col gap-8 px-6 py-7">
              <dl className="flex flex-col gap-0 border-y border-[var(--hairline)] divide-y divide-[var(--hairline)]">
                {FIELDS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 py-2.5"
                  >
                    <dt className="readout">{k}</dt>
                    <dd className="text-right text-[13px] text-[var(--ink)]">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--ink)]/85">
                I&rsquo;m a producer, director, and director of photography with
                over a decade behind the lens, crafting authentic stories with a
                cinematic eye. My work spans award-nominated documentaries like
                Deadliest Catch and Life Below Zero&mdash;more than 200 produced
                and 130 directed hours of prime-time programming&mdash;alongside
                campaigns and branded content for high-profile clients. I bring
                creativity, problem-solving, and collaboration to every shoot,
                so the process stays as engaging as the final cut.
              </p>

              <nav className="flex flex-col border-t border-[var(--hairline)]">
                {LINKS.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group flex items-center justify-between border-b border-[var(--hairline)] py-3 text-[13px] text-[var(--ink)] transition-colors hover:text-[var(--ink-dim)]"
                  >
                    <span>{label}</span>
                    <span className="text-[var(--ink-faint)] transition-transform duration-200 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                ))}
              </nav>

              <p className="mt-auto pt-6 text-[10px] tracking-wide text-[var(--ink-faint)]">
                website by{' '}
                <a
                  href="https://thirdindex.co"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 transition-colors hover:text-[var(--ink-dim)] hover:underline"
                >
                  THIRD INDEX
                </a>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
