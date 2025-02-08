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
      className={cn(
        'fixed top-0 flex justify-between items-start w-full px-2 md:px-4 z-50 mix-blend-difference text-white min-h-8',
        isPlaying && 'z-35'
      )}
    >
      <div className="flex-1">
        <Link
          href="/work"
          className="text-sm md:text-2xl font-black translate-y-1.5 inline-flex items-center relative pr-6 md:pr-8"
        >
          WORK
          {pathname === '/work' && (
            <Dot
              size="32"
              className="absolute right-0 top-1/2 -translate-y-[calc(50%_+_1px)] scale-[2] md:scale-[3] pointer-events-none"
            />
          )}
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center">
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
        <Link href="/" className="md:hidden">
          <div className="text-sm md:text-2xl translate-y-[10px] leading-none font-black text-center uppercase tracking-tighter whitespace-nowrap">
            Kelvon Agee
          </div>
        </Link>
        <div className="hidden md:block">
          {isHome && (
            <TextEffect
              per="word"
              as="p"
              // preset="blur"
              preset="fade-in-blur"
              speedReveal={3}
              speedSegment={0.6}
            >
              Visual Storyteller. EST 1986
            </TextEffect>
          )}
        </div>
      </div>

      <div className="flex-1 flex justify-end">
        <Link
          href="/info"
          className="text-sm md:text-2xl font-black translate-y-1.5 flex items-center relative pl-6 md:pl-8"
        >
          {pathname === '/info' && (
            <Dot
              size="32"
              className="absolute left-0 top-1/2 -translate-y-[calc(50%_+_1px)] scale-[2] md:scale-[3] pointer-events-none"
            />
          )}
          INFO
        </Link>
      </div>
    </header>
  )
}
