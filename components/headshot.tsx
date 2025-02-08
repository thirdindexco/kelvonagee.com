'use client'

import { motion } from 'motion/react'
import { use, useEffect, useState } from 'react'

export function Headshot() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div
        className="relative h-full w-full will-change-transform"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={
          isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }
        }
        transition={{ duration: 1, ease: 'easeInOut', delay: 0.15 }}
      >
        <img
          className="object-cover w-full h-full"
          src="/hero.jpg"
          alt=""
          // onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* <div className="w-full col-span-3 h-[calc(100vh_-_96px_-_1rem)] relative">
          <img
            src="/hero.jpg"
            alt="Kelvon Agee"
            className="object-cover w-full h-full"
          />
        </div> */}
      </motion.div>
    </div>
  )
}
