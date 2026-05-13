import Image from 'next/image'
import cloudinaryLoader from '@/lib/cloudinary'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CloudinaryImageProps {
  publicId: string
  alt: string
  width: number
  height: number
  className?: string
  sizes?: string
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Image
      loader={cloudinaryLoader}
      src={publicId || '/placeholder.svg'}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={cn(
        'transition-all duration-300 ease-in-out',
        isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0',
        className
      )}
      onLoadingComplete={() => setIsLoading(false)}
    />
  )
}
