'use client'

import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Headshot() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <motion.div
      className={cn(
        'relative w-full will-change-transform',
        'aspect-[5/8] md:h-[calc(100dvh_-_96px_-_1rem)]' // Height calculation for desktop
      )}
      initial={{ opacity: 0, scale: 1.2 }}
      animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.15 }}
    >
      <img
        className="object-cover w-full h-full"
        src="/hero.jpg"
        alt="Kelvon Agee"
        onLoad={() => setIsLoaded(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </motion.div>
  )
}
