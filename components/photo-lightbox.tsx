'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import cloudinaryLoader from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

export interface LightboxImage {
  public_id: string
  width: number
  height: number
}

interface PhotoLightboxProps {
  images: LightboxImage[]
  index: number | null
  onClose: () => void
  onIndexChange: (i: number) => void
}

const SWIPE_THRESHOLD = 50

export function PhotoLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: PhotoLightboxProps) {
  const [mounted, setMounted] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const isOpen = index !== null
  const current = isOpen ? images[index] : null

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (!images.length) return
      const wrapped = (next + images.length) % images.length
      setDirection(dir)
      onIndexChange(wrapped)
    },
    [images.length, onIndexChange]
  )

  const next = useCallback(
    () => index !== null && goTo(index + 1, 1),
    [index, goTo]
  )
  const prev = useCallback(
    () => index !== null && goTo(index - 1, -1),
    [index, goTo]
  )

  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('overflow-hidden')

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, next, prev, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10 flex items-center gap-3">
            <span className="caption text-white/70 tabular-nums">
              {(index ?? 0) + 1} / {images.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="p-2 -m-2 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </button>
          </div>

          <NavButton side="left" onClick={prev} />
          <NavButton side="right" onClick={next} />

          <div
            className="absolute inset-0 flex items-center justify-center p-4 md:p-16"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              <motion.div
                key={current.public_id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.25, 0, 1],
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_THRESHOLD) next()
                  else if (info.offset.x > SWIPE_THRESHOLD) prev()
                }}
                className="relative max-h-full max-w-full flex items-center justify-center touch-pan-y"
              >
                <Image
                  loader={cloudinaryLoader}
                  src={current.public_id}
                  alt=""
                  width={current.width}
                  height={current.height}
                  sizes="100vw"
                  priority
                  draggable={false}
                  className="max-h-[90dvh] w-auto h-auto object-contain select-none pointer-events-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function NavButton({
  side,
  onClick,
}: {
  side: 'left' | 'right'
  onClick: () => void
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-10',
        'p-3 md:p-4 text-white/60 hover:text-white transition-colors',
        side === 'left' ? 'left-1 md:left-4' : 'right-1 md:right-4'
      )}
    >
      <Icon className="w-7 h-7 md:w-9 md:h-9" strokeWidth={1.25} />
    </button>
  )
}
