'use client'

import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { cn } from '@/lib/utils'
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

// Convert decimal to fraction (e.g., 1.5 becomes "3/2")
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)

const fractionize = (decimal: number) => {
  const precision = 1000
  const numerator = decimal * precision
  const denominator = precision
  const divisor = gcd(numerator, denominator)
  return `${Math.round(numerator / divisor)}/${Math.round(
    denominator / divisor
  )}`
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
      className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
    >
      {images.map((image) => {
        const isLandscape = image.width > image.height
        const aspectRatio = fractionize(image.width / image.height)

        return (
          <motion.div
            key={image.public_id}
            variants={item}
            className="break-inside-avoid mb-4"
          >
            <div className={cn('relative w-full', `aspect-[${aspectRatio}]`)}>
              <CloudinaryImage
                alt=""
                publicId={image.public_id}
                width={isLandscape ? 1200 : 800}
                height={isLandscape ? 675 : 1067}
              />
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
