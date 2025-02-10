'use client'

import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { motion } from 'motion/react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

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
    <ResponsiveMasonry columnsCountBreakPoints={{ 639: 1, 640: 2, 768: 3 }}>
      <Masonry>
        {images.map((image) => {
          const isLandscape = image.width > image.height

          return (
            <motion.div
              key={image.public_id}
              variants={item}
              className="break-inside-avoid w-full inline-block"
            >
              <CloudinaryImage
                alt=""
                publicId={image.public_id}
                width={1200}
                height={isLandscape ? 675 : 900}
                className="w-full h-auto"
              />
            </motion.div>
          )
        })}
      </Masonry>
    </ResponsiveMasonry>
  )
}
