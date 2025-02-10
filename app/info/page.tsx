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
        <div className="sm:col-span-3 md:col-span-3 md:h-[calc(100dvh_-_96px_-_1rem)] overflow-hidden order-2 md:order-1">
          <Headshot />
        </div>

        {/* Text content */}
        <div className="sm:col-span-5 flex flex-col justify-between order-1 md:order-2 gap-4">
          <div className="flex flex-col gap-y-8 md:pt-20 lg:pt-40">
            <h2 className="indent-20 md:indent-44 text-pretty md:text-4xl">
              <TextEffect
                per="line"
                as="span"
                preset="fade-in-blur"
                speedReveal={3}
                speedSegment={0.6}
              >
                I’m a Producer, Director, and Director of Photography with over
                a decade of experience capturing authentic stories through a
                cinematic lens.
              </TextEffect>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextEffect
                per="line"
                as="p"
                preset="fade-in-blur"
                speedReveal={3}
                speedSegment={0.4}
              >
                My work spans documentary projects like Deadliest Catch, Life
                Below Zero, and World’s Toughest Race: Eco-Challenge Fiji,
                totaling over 200 produced and 130 directed hours of prime-time
                programming. I’ve captured extreme environments, compelling
                human stories, and high-stakes moments, earning five Primetime
                Emmy nominations for Cinematography. With a deep passion for
                visual storytelling, I strive to craft narratives that are both
                cinematic and authentic.
              </TextEffect>
              <TextEffect
                per="line"
                as="p"
                preset="fade-in-blur"
                speedReveal={3}
                speedSegment={0.2}
              >
                Beyond documentaries, I’ve shot campaigns and branded content
                for high-profile clients, including NBA legend Chris Paul,
                Grammy-winning artist Seal (Leica), Cotrini Beauty, The Dick
                Butkus Award (Big 10 Network), and Logitech. Whether working
                with global brands or individual visionaries, I bring
                creativity, problem-solving, and collaboration to every
                project—ensuring the process is as engaging as the final
                product.
              </TextEffect>
            </div>
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
