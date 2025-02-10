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
      delayChildren: 1,
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
        {/* Headshot container */}
        <div className="sm:col-span-4 md:col-span-3 md:h-[calc(100dvh_-_96px_-_1rem)] overflow-hidden order-2 md:order-1">
          <Headshot />
        </div>

        {/* Text content */}
        <div className="sm:col-span-4 md:col-span-5 flex flex-col justify-between order-1 md:order-2 gap-4">
          <div className="flex flex-col gap-y-8">
            <h2 className="indent-20 md:indent-40">
              <TextEffect
                per="line"
                as="span"
                preset="fade-in-blur"
                speedReveal={3}
                speedSegment={0.6}
              >
                I’m a Producer, Director, and Director of Photography (DP) with
                over a decade of experience capturing authentic stories through
                a cinematic lens. My work includes projects like Deadliest
                Catch, Life Below Zero, and World’s Toughest Race: Eco-Challenge
                Fiji, totaling over 200 produced and 130 directed hours of
                prime-time programming. With five Primetime Emmy nominations for
                Cinematography, I bring a sharp eye for storytelling to every
                project.
              </TextEffect>
            </h2>
            <h2>
              <TextEffect
                per="line"
                as="span"
                preset="fade-in-blur"
                speedReveal={3}
                speedSegment={0.6}
              >
                Beyond documentaries, I’ve filmed campaigns and branded content
                for clients like NBA legend Chris Paul, Grammy-winning artist
                Seal (Leica), Cotrini Beauty, The Dick Butkus Award (Big 10
                Network), and Logitech. I’m passionate about telling impactful
                stories and thrive on creativity, problem-solving, and
                collaboration to produce meaningful, dynamic content—while
                making the process as engaging as the final product.
              </TextEffect>
            </h2>
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
      </div>
    </main>
  )
}
