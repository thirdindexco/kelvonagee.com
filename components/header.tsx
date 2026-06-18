'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useAtom } from 'jotai/react'
import { reelPlayerAtom } from '@/state'
import { TextEffect } from '@/components/ui/text-effect'
import { cn } from '@/lib/utils'

const SCALE_SMALL = 0.25 // collapsed size ≈ nav text

export function Header() {
  const [{ mode }] = useAtom(reelPlayerAtom)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isPortfolio = pathname === '/portfolio'
  const isInfo = pathname === '/info'

  // Size is purely route-driven: large on home + info, small on portfolio. The
  // header persists across navigations, so framer animates the change between
  // routes. Tagline shows on home only.
  const targetScale = isPortfolio ? SCALE_SMALL : 1

  return (
    <header
      className={cn('fixed top-0 z-30 text-black w-full', {
        'mix-blend-difference text-white': mode !== 'playing',
      })}
    >
      <div className="relative px-4 md:px-6 pt-2">
        <div className="flex items-start justify-between">
          <Link
            href="/portfolio"
            className={cn(
              'text-sm md:text-2xl font-black hover:text-white text-muted-foreground transition-colors',
              { 'text-white': isPortfolio }
            )}
          >
            PORTFOLIO
          </Link>
          <Link
            href="/info"
            className={cn(
              'text-sm md:text-2xl font-black hover:text-white text-muted-foreground transition-colors',
              { 'text-white': isInfo }
            )}
          >
            INFO
          </Link>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 flex flex-col items-center">
          <Link href="/" className="pointer-events-auto">
            <motion.span
              initial={false}
              animate={{ scale: targetScale }}
              transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="block leading-none font-black text-center uppercase tracking-tighter whitespace-nowrap text-[clamp(2.75rem,8vw,6rem)] will-change-transform"
            >
              Kelvon Agee
            </motion.span>
          </Link>
          <TextEffect
            per="word"
            as="p"
            preset="fade-in-blur"
            speedReveal={3}
            speedSegment={0.6}
            trigger={isHome}
            className="caption mt-3 md:mt-4 text-center"
          >
            Visual Storyteller. EST 1986
          </TextEffect>
        </div>
      </div>
    </header>
  )
}
