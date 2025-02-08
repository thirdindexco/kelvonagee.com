'use client'

import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { motion } from 'motion/react'

const container = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  initial: { filter: 'blur(4px)', y: 20, opacity: 0 },
  animate: {
    filter: 'blur(0px)',
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1],
    },
  },
}

export function Photos() {
  const { images, isLoading, error } = useCloudinaryImages('kelvonagee.com')

  if (isLoading || error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="caption">
          {error ? `Error: ${error}` : 'Loading...'}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={container}
      className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-2"
    >
      {images.map((image) => {
        const isLandscape = image.width > image.height
        const aspectRatio = image.width / image.height

        return (
          <motion.div
            key={image.public_id}
            variants={item}
            className="break-inside-avoid-column w-full inline-block"
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
            >
              <CloudinaryImage
                alt=""
                publicId={image.public_id}
                width={isLandscape ? 1920 : 1080}
                height={Math.round(
                  isLandscape ? 1920 / aspectRatio : 1080 * aspectRatio
                )}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
