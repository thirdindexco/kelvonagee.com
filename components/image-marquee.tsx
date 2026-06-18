'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { cn } from '@/lib/utils'

export function ImageMarquee() {
  const { images } = useCloudinaryImages('kelvonagee.com')
  const [hovered, setHovered] = useState(false)
  // Hover-reveal only makes sense on devices that can hover; touch devices
  // keep the CTA visible. Resolved on the client (this only renders once images
  // have loaded, which is also client-side, so there's no SSR flash).
  const [canHover] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover)').matches
  )

  // Nothing renders — including the CTA — until the images have loaded.
  if (!images.length) return null

  // A trimmed set, duplicated once so the row can loop seamlessly.
  const set = images.slice(0, 24)
  const loop = [...set, ...set]
  const duration = set.length * 5
  const ctaVisible = !canHover || hovered

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-end px-2 md:px-3 mb-2 md:mb-3">
        <Link
          href="/portfolio"
          className={cn(
            'inline-flex items-center gap-1.5 text-sm md:text-base font-black uppercase tracking-tight text-muted-foreground hover:text-black transition-all duration-300 ease-out',
            ctaVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          See all photos
          <ArrowRight className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={2.25} />
        </Link>
      </div>

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
    </div>
  )
}
