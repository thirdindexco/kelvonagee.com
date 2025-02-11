'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { Dot } from 'lucide-react'
import { useAtom } from 'jotai/react'
import { reelPlayerAtom } from '@/state'
import { cn } from '@/lib/utils'

export function Header() {
  const [{ isPlaying }, setReel] = useAtom(reelPlayerAtom)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isWork = pathname === '/work'
  const isInfo = pathname === '/info'

  return (
    <header
      className={cn('fixed top-0 z-30 text-black w-full', {
        'mix-blend-difference text-white': !isPlaying,
      })}
    >
      <div className="relative w-full min-h-8 flex items-center">
        <div className="absolute h-full left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
          <Link href="/" className="hidden md:block">
            <motion.div
              initial={{ fontSize: '24px', y: 0 }}
              animate={{
                fontSize: isHome || isInfo ? '96px' : '24px',
                y: isHome || isInfo ? 0 : 10,
              }}
              transition={{ duration: 0.1, easing: 'ease-in-out' }}
              className="text-2xl leading-none font-black text-center uppercase tracking-tighter whitespace-nowrap"
            >
              Kelvon Agee
            </motion.div>
          </Link>
          <Link
            href="/"
            className="md:hidden h-full flex items-center justify-center translate-y-1"
          >
            <div className="text-sm md:text-2xl leading-none font-black text-center uppercase tracking-tighter whitespace-nowrap">
              Kelvon Agee
            </div>
          </Link>
          <div className="hidden md:block">
            {isHome && (
              <TextEffect
                per="word"
                as="h2"
                preset="fade-in-blur"
                speedReveal={3}
                speedSegment={0.6}
              >
                Visual Storyteller. EST 1986
              </TextEffect>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full min-h-8 pt-2 px-2 md:px-4">
          <Link
            href="/work"
            className={cn(
              'text-sm md:text-2xl font-black flex hover:text-white text-muted-foreground transition-colors',
              {
                'text-white': isWork,
              }
            )}
          >
            WORK
          </Link>

          <Link
            href="/info"
            className={cn(
              'text-sm md:text-2xl font-black flex justify-end text-muted-foreground hover:text-white transition-colors',
              {
                'text-white': isInfo,
              }
            )}
          >
            INFO
          </Link>
        </div>
      </div>
    </header>
  )
}
