'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAtom } from 'jotai/react'
import { reelPlayerAtom } from '@/state'
import { TextEffect } from '@/components/ui/text-effect'
import { cn } from '@/lib/utils'

export function Header() {
  const [{ mode }] = useAtom(reelPlayerAtom)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isPortfolio = pathname === '/portfolio'
  const isInfo = pathname === '/info'

  // Mobile: the name is always nav-sized (no large state), so it never overlaps
  // the links. Desktop (md+) is route-driven — large on home/info, small on
  // portfolio — and the font-size transition animates the change on navigation.
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
            <span
              className={cn(
                'block font-black text-center uppercase tracking-tighter whitespace-nowrap',
                'transition-[font-size] duration-300 ease-[cubic-bezier(0.25,0.25,0,1)] will-change-[font-size]',
                'text-sm',
                isPortfolio
                  ? 'md:text-2xl'
                  : 'md:text-[clamp(2.75rem,8vw,6rem)] md:-mt-[0.054em]',
                'leading-none'
              )}
            >
              Kelvon Agee
            </span>
          </Link>
          <TextEffect
            per="word"
            as="p"
            preset="fade-in-blur"
            speedReveal={3}
            speedSegment={0.6}
            trigger={isHome}
            className="caption mt-2 md:mt-4 text-center"
          >
            Visual Storyteller. EST 1986
          </TextEffect>
        </div>
      </div>
    </header>
  )
}
