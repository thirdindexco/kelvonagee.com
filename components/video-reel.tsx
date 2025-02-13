'use client'

import { useEffect, useRef, useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { useAtom } from 'jotai'
import { reelPlayerAtom } from '@/state'
import { motion } from 'motion/react'
import useIsMobile from '@/hooks/useIsMobile'

const videoAnimation = {
  initial: {
    y: 40,
    opacity: 0,
    filter: 'blur(8px)',
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1],
      delay: 0.3,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1],
    },
  },
}

export function VideoReel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [{ mode, duration, currentTime }, setReel] = useAtom(reelPlayerAtom)
  const [showText, setShowText] = useState(false)
  const isMobile = useIsMobile()

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(!showText)
    }, 500)

    return () => clearTimeout(timer)
  }, [mode])

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setReel({
        currentTime,
        duration: videoRef.current.duration,
        mode,
      })
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setReel({
        currentTime: videoRef.current.currentTime,
        duration,
        mode,
      })
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (mode === 'idle' || mode === 'paused') {
        videoRef.current.play()
        setReel({ duration, currentTime, mode: 'playing' })
      } else {
        videoRef.current.pause()
        setReel({ duration, currentTime, mode: 'paused' })
      }
    }
  }

  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (videoRef.current) {
      videoRef.current.pause()
      setReel({ duration, currentTime, mode: 'idle' })
    }
  }

  const handleThumbnailClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (mode === 'idle' || mode === 'paused') {
      videoRef.current?.play()
      setReel({ duration, currentTime, mode: 'playing' })
    }
  }

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (mode === 'idle' || mode === 'paused') {
        videoRef.current.play()
      }
    }
  }

  const renderVideo = () => (
    <motion.video
      layout="preserve-aspect"
      ref={videoRef}
      variants={videoAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'aspect-video outline-none z-50',
        mode === 'playing' && !isMobile
          ? 'max-w-[90vw] md:max-w-[80vw]'
          : 'w-full'
      )}
      playsInline
      controls={mode === 'playing'}
      poster="//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1220,q_auto/nfreyhnd41z7lzuwddas_vtvhfh"
      src="//res.cloudinary.com/dxcvsjlxr/video/upload/f_auto:video,q_auto/Kelvonagee_Reel_t14uxl"
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      onPlaying={() => setReel({ duration, currentTime, mode: 'playing' })}
      onPause={() => setReel({ duration, currentTime, mode })}
      onEnded={() => setReel({ duration, currentTime, mode: 'idle' })}
    />
  )

  return (
    <>
      {isMobile ? (
        <div
          className="flex flex-col gap-y-1 relative"
          onClick={handleVideoClick}
        >
          <div
            className="text-right caption cursor-pointer"
            onClick={toggleVideo}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          {renderVideo()}
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            'relative cursor-pointer',
            mode === 'playing' &&
              'fixed inset-0 z-40 flex items-center justify-center'
          )}
        >
          {mode != 'idle' && (
            <motion.div
              onClick={handleMaskClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="fixed inset-0 z-30 bg-black/10 backdrop-blur-md"
            />
          )}

          {mode == 'idle' && (
            <div
              onClick={handleThumbnailClick}
              className="fixed inset-0 z-30"
            />
          )}

          {mode !== 'playing' && showText && (
            <div className="text-right caption pb-1">
              Play reel — {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}
          {renderVideo()}
        </motion.div>
      )}
    </>
  )
}
