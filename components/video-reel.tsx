'use client'

import { useEffect, useRef, useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { useAtom } from 'jotai'
import { reelPlayerAtom } from '@/state'
import { motion } from 'motion/react'
import useIsMobile from '@/hooks/useIsMobile'

export function VideoReel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [{ isPlaying, duration, currentTime }, setReel] =
    useAtom(reelPlayerAtom)
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
        currentTime: videoRef.current.currentTime,
        isPlaying,
        duration,
      })
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleVideoClick = (e: any) => {
    e.preventDefault()
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current.play()
      }
    }
  }

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-y-1 relative">
          {/* {!isPlaying && (
            <div
              className="absolute inset-0 w-full h-full"
              onClick={toggleVideo}
            />
          )} */}
          <div
            className="text-right caption cursor-pointer"
            onClick={toggleVideo}
          >
            {isPlaying ? 'Pause' : 'Play'} reel — {formatTime(currentTime)} /{' '}
            {formatTime(duration)}
          </div>
          <video
            ref={videoRef}
            className="aspect-video outline-none z-50 w-full"
            playsInline
            controls={isPlaying}
            poster="//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1220,q_auto/nfreyhnd41z7lzuwddas_vtvhfh"
            src="//res.cloudinary.com/dxcvsjlxr/video/upload/f_auto:video,q_auto/Kelvonagee_Reel_t14uxl"
            onTouchStart={toggleVideo}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlaying={() =>
              setReel({ duration, currentTime, isPlaying: true })
            }
            onPause={() => setReel({ duration, currentTime, isPlaying: false })}
            onEnded={() => setReel({ duration, currentTime, isPlaying: false })}
          />
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            'relative cursor-pointer',
            isPlaying && 'fixed inset-0 z-40 flex items-center justify-center'
          )}
          onClick={handleVideoClick}
        >
          {isPlaying && (
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

          {!isPlaying && showText && (
            <div className="text-right caption pb-1">
              Play reel — {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}

          <motion.video
            layout="preserve-aspect"
            ref={videoRef}
            className={cn(
              'aspect-video outline-none z-50',
              isPlaying ? 'max-w-[90vw] md:max-w-[80vw]' : 'w-full'
            )}
            playsInline
            controls={isPlaying}
            poster="//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1220,q_auto/nfreyhnd41z7lzuwddas_vtvhfh"
            src="//res.cloudinary.com/dxcvsjlxr/video/upload/f_auto:video,q_auto/Kelvonagee_Reel_t14uxl"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlaying={() =>
              setReel({ duration, currentTime, isPlaying: true })
            }
            onPause={() => setReel({ duration, currentTime, isPlaying: false })}
            onEnded={() => setReel({ duration, currentTime, isPlaying: false })}
          />
        </motion.div>
      )}
    </>
  )
}
