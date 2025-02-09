'use client'

import { Headshot } from '@/components/headshot'
import { TextEffect } from '@/components/ui/text-effect'
import { motion } from 'motion/react'

const links = [
  {
    label: undefined,
    text: 'IMDB',
    href: 'https://www.imdb.com/name/nm5559286/',
  },
  {
    label: undefined,
    text: 'Instagram',
    href: 'https://instagram.com/lordkelvon',
  },
  {
    label: 'Email',
    text: 'kelvon@kelvonagee.com',
    href: 'mailto:kelvon@kelvonagee.com',
  },
]

const container = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 2,
    },
  },
}

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function Info() {
  return (
    <main className="bg-black text-white pt-[52px] md:pt-[96px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-8">
        {/* Mobile: Text first, Headshot second */}
        <div className="sm:col-span-3 md:col-span-5 flex flex-col justify-between text-y-2 gap-y-4 order-1 md:order-2">
          <div>
            <TextEffect
              per="word"
              as="p"
              preset="fade-in-blur"
              speedReveal={3}
              speedSegment={0.6}
            >
              I'm a Producer, Director, and DP with 10+ years of documentary
              storytelling experience, including Deadliest Catch and Life Below
              Zero, earning five Primetime Emmy nominations. I specialize in
              bringing authentic stories to life through purposeful content and
              creative collaboration. Based in LA/NY.
            </TextEffect>
          </div>

          <motion.ul
            className="m-0 flex flex-col gap-y-1"
            initial="initial"
            animate="animate"
            variants={container}
          >
            {links.map(({ text, href }) => (
              <motion.li
                key={href}
                variants={item}
                className="text-base font-black leading-none"
              >
                <a
                  className="underline hover:no-underline hover:text-white/80"
                  href={href}
                >
                  {text}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Headshot container */}
        <div className="sm:col-span-5 md:col-span-3 md:h-[calc(100dvh_-_96px] md:mx-0 order-2 md:order-1 overflow-hidden">
          <Headshot />
        </div>
      </div>
    </main>
  )
}
