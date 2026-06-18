'use client'

import { motion } from 'motion/react'
import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'

export function ImageMarquee() {
  const { images } = useCloudinaryImages('kelvonagee.com')

  if (!images.length) return null

  // A trimmed set, duplicated once so the row can loop seamlessly.
  const set = images.slice(0, 24)
  const loop = [...set, ...set]
  const duration = set.length * 5

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex w-max gap-2 md:gap-3"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((img, i) => (
          <div
            key={`${img.public_id}-${i}`}
            className="relative h-[18vh] max-h-[200px] shrink-0 overflow-hidden bg-white/5"
            style={{ aspectRatio: `${img.width} / ${img.height}` }}
          >
            <CloudinaryImage
              alt=""
              publicId={img.public_id}
              width={img.width}
              height={img.height}
              sizes="40vh"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
