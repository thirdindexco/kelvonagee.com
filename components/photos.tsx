'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { CloudinaryImage } from '@/components/cloudinary-image'
import { useCloudinaryImages } from '@/hooks/useCloudinaryImages'
import { PhotoLightbox } from '@/components/photo-lightbox'

interface ImageData {
  public_id: string
  width: number
  height: number
}

interface RowItem extends ImageData {
  originalIndex: number
  width: number
}

interface Row {
  items: RowItem[]
  height: number
}

function targetRowHeight(containerWidth: number): number {
  if (containerWidth < 640) return 130
  if (containerWidth < 1024) return 190
  if (containerWidth < 1536) return 240
  return 280
}

// Gutter between thumbnails. Matches the viewport-edge padding on `main`
// (px-4 md:px-6) so spacing inside the grid equals spacing around it.
function gridGap(containerWidth: number): number {
  if (containerWidth < 768) return 16
  return 24
}

function buildRows(
  images: ImageData[],
  containerWidth: number,
  target: number,
  gap: number
): Row[] {
  if (!containerWidth || !images.length) return []

  const rows: Row[] = []
  let pending: { img: ImageData; originalIndex: number; ratio: number }[] = []
  let aspectSum = 0

  images.forEach((img, originalIndex) => {
    const ratio = img.width / img.height
    pending.push({ img, originalIndex, ratio })
    aspectSum += ratio

    const idealWidth = aspectSum * target + (pending.length - 1) * gap
    if (idealWidth >= containerWidth) {
      const height = (containerWidth - (pending.length - 1) * gap) / aspectSum
      rows.push({
        items: pending.map((p) => ({
          ...p.img,
          originalIndex: p.originalIndex,
          width: height * p.ratio,
        })),
        height,
      })
      pending = []
      aspectSum = 0
    }
  })

  if (pending.length) {
    rows.push({
      items: pending.map((p) => ({
        ...p.img,
        originalIndex: p.originalIndex,
        width: target * p.ratio,
      })),
      height: target,
    })
  }

  return rows
}

export function Photos() {
  const { images, isLoading, error } = useCloudinaryImages('kelvonagee.com')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (!containerEl) return
    setContainerWidth(containerEl.clientWidth)
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(containerEl)
    return () => ro.disconnect()
  }, [containerEl])

  const gap = gridGap(containerWidth)
  const rows = useMemo(
    () => buildRows(images, containerWidth, targetRowHeight(containerWidth), gap),
    [images, containerWidth, gap]
  )

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
    <>
      <div ref={setContainerEl}>
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex"
            style={{
              gap: gap,
              marginBottom: ri < rows.length - 1 ? gap : 0,
            }}
          >
            {row.items.map((item) => (
              <motion.button
                key={item.public_id}
                type="button"
                onClick={() => setOpenIndex(item.originalIndex)}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(item.originalIndex * 0.015, 0.4),
                  ease: [0.25, 0.25, 0, 1],
                }}
                whileHover={{ opacity: 0.85 }}
                style={{
                  width: item.width,
                  height: row.height,
                  flex: `0 0 ${item.width}px`,
                }}
                className="block overflow-hidden bg-white/5 cursor-zoom-in focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
                aria-label={`Open photo ${item.originalIndex + 1}`}
              >
                <CloudinaryImage
                  alt=""
                  publicId={item.public_id}
                  width={item.width}
                  height={item.height}
                  sizes={`${Math.round(item.width)}px`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <PhotoLightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  )
}
