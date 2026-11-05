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

/* Fills its (relatively positioned, aspect-sized) parent. A skeleton shimmer
   holds the tile while the photo streams in, then the image fades over it. */
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
    <>
      {isLoading && (
        <span className="skeleton pointer-events-none absolute inset-0" aria-hidden />
      )}
      <Image
        loader={cloudinaryLoader}
        src={publicId || '/placeholder.svg'}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </>
  )
}
