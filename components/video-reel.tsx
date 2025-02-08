'use client'

import { useEffect, useRef, useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { useAtom } from 'jotai'
import { reelPlayerAtom } from '@/state'
import { motion } from 'motion/react'

export function VideoReel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [{ isPlaying, duration, currentTime }, setReel] =
    useAtom(reelPlayerAtom)
  const [showText, setShowText] = useState(false)

  // Save video time before unmount
  useEffect(() => {
    const video = videoRef.current

    return () => {
      if (video) {
        // Store the current time before unmounting
        localStorage.setItem('videoTime', video.currentTime.toString())
      }
    }
  }, [])

  // Restore video time on mount
  useEffect(() => {
    const video = videoRef.current
    const savedTime = localStorage.getItem('videoTime')

    if (video && savedTime) {
      video.currentTime = parseFloat(savedTime)
      setReel((prev) => ({
        ...prev,
        currentTime: parseFloat(savedTime),
      }))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(!showText)
    }, 500)

    return () => clearTimeout(timer)
  }, [isPlaying])

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setReel({
        currentTime,
        isPlaying,
        duration: videoRef.current.duration,
      })
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setReel({
        isPlaying,
        duration,
        currentTime: videoRef.current.currentTime,
      })
    }
  }

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play()
      }
    }
  }

  return (
    <motion.div
      layout
      className={cn(
        'relative cursor-pointer',
        isPlaying && 'fixed inset-0 z-10 flex items-center justify-center'
      )}
      onClick={handleVideoClick}
    >
      {!isPlaying && showText && (
        <div className="text-right caption pb-1">
          Play reel — {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}

      <motion.video
        layout
        ref={videoRef}
        className={cn(
          'aspect-video outline-none',
          isPlaying ? 'max-w-[90vw] md:max-w-[80vw]' : 'w-full'
        )}
        playsInline
        controls={isPlaying}
        poster="//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1220,q_auto/nfreyhnd41z7lzuwddas_vtvhfh"
        src="//res.cloudinary.com/dxcvsjlxr/video/upload/f_auto:video,q_auto/Kelvonagee_Reel_t14uxl"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlaying={() => setReel({ duration, currentTime, isPlaying: true })}
        onPause={() => setReel({ duration, currentTime, isPlaying: false })}
        onEnded={() => setReel({ duration, currentTime, isPlaying: false })}
      />
    </motion.div>
  )
}
