'use client'

import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

export function Photos() {
  const { images, isLoading, error } = useCloudinaryImages('kelvonagee.com')

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="caption">Loading...</div>
      </div>
    )

  if (error)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="caption">Error: {error}</div>
      </div>
    )

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 1: 1, 640: 2, 768: 3 }}>
      <Masonry>
        {images.map((image) => (
          <div
            key={image.public_id}
            className="break-inside-avoid flex items-center justify-center w-full"
          >
            <CloudinaryImage
              publicId={image.public_id}
              alt=""
              width={900}
              height={600}
            />
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
