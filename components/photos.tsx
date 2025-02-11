'use client'

import { useEffect, useRef, useState } from 'react'
import { Masonry } from 'masonic'
import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { motion, useAnimation } from 'motion/react'
import { getResponsiveColumns } from '@/lib/utils'
import useIsMobile from '@/hooks/useIsMobile'

interface MasonryCardProps {
  data: {
    public_id: string
    width: number
    height: number
  }
}

const MasonryCard = ({ data }: MasonryCardProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isLandscape = data.width > data.height

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.25, 0.25, 0, 1] },
    })
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={controls}
      className="w-full"
    >
      <CloudinaryImage
        alt=""
        publicId={data.public_id}
        width={1200}
        height={isLandscape ? 675 : 900}
        className="w-full h-auto"
      />
    </motion.div>
  )
}

export function Photos() {
  const { images, isLoading, error } = useCloudinaryImages('kelvonagee.com')
  const [columnCount, setColumnCount] = useState(3)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setColumnCount(getResponsiveColumns(window.innerWidth))
      }
    }

    handleResize() // Initial call
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <Masonry
      items={images}
      columnGutter={isMobile ? 8 : 16}
      columnWidth={350}
      render={MasonryCard}
      columnCount={columnCount}
    />
  )
}
