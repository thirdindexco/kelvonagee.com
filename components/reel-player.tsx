'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

const POSTER =
  '//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1600,q_auto/nfreyhnd41z7lzuwddas_vtvhfh'
const SRC =
  '//res.cloudinary.com/dxcvsjlxr/video/upload/f_auto:video,q_auto/Kelvonagee_Reel_t14uxl'

export function ReelPlayer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const v = videoRef.current
    const saved = v && localStorage.getItem('reelTime')
    if (v && saved) v.currentTime = parseFloat(saved)
    v?.play().catch(() => {})
    return () => {
      window.removeEventListener('keydown', onKey)
      if (v) localStorage.setItem('reelTime', String(v.currentTime))
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 backdrop-blur-md p-4 md:p-14"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close reel"
            className="absolute right-4 top-4 z-10 flex items-center gap-2 text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
          >
            <span className="readout">Close</span>
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <motion.video
            ref={videoRef}
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86dvh] w-auto max-w-full outline-none"
            poster={POSTER}
            src={SRC}
            controls
            playsInline
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
