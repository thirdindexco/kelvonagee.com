import Image from 'next/image'
import cloudinaryLoader from '@/lib/cloudinary'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CloudinaryImageProps {
  publicId: string
  alt: string
  width: number
  height: number
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Image
      loader={cloudinaryLoader}
      src={publicId || '/placeholder.svg'}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      placeholder="blur"
      blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_50,e_blur:1000/${publicId}`}
      className={cn(
        'transition-all duration-300 ease-in-out',
        isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
      )}
      onLoadingComplete={() => setIsLoading(false)}
    />
  )
}
