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
      delayChildren: 0.8, // Delay after text animation
    },
  },
}

const item = {
  initial: { y: 20, opacity: 0, filter: 'blur(4px)' },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1] as [number, number, number, number],
    },
  },
}

export default function Info() {
  return (
    <main className="bg-black text-white pt-[72px] md:pt-[120px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-8">
        {/* Headshot container */}
        <div className="sm:col-span-4 md:col-span-3 md:h-[calc(100dvh_-_120px_-_1rem)] overflow-hidden order-2 md:order-1">
          <Headshot />
        </div>

        {/* Text content */}
        <div className="sm:col-span-4 md:col-span-5 flex flex-col justify-between order-1 md:order-2 gap-4">
          <div className="flex flex-col gap-y-8">
            <TextEffect
              className="display"
              per="line"
              as="span"
              preset="fade-in-blur"
              speedReveal={4}
              speedSegment={0.6}
            >
              I’m a Producer, Director, and Director of Photography (DP) with
              over a decade of experience crafting authentic stories through a
              cinematic lens. My work spans award-nominated documentaries like
              Deadliest Catch and Life Below Zero, totaling over 200 produced
              and 130 directed hours of prime-time programming. Beyond
              documentaries, I’ve shot campaigns and branded content for
              high-profile clients, blending creativity, problem-solving, and
              collaboration to produce compelling, dynamic content—while
              ensuring the process is as engaging as the final product.
            </TextEffect>
          </div>

          <motion.ul
            variants={container}
            initial="initial"
            animate="animate"
            className="m-0 flex flex-col gap-y-1"
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
      </div>
    </main>
  )
}
