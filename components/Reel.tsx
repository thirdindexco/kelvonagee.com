'use client'
import { createRef, useEffect } from 'react'
import { cn } from '~/utils/cn'
import { useAtom } from 'jotai'
import { reelPlayerAtom, reelRefAtom } from '~/store'
import { useRouter } from 'next/router'

export default function Reel() {
  const localReelRef = createRef<HTMLVideoElement>()
  const [reelRef, setReelRef] = useAtom(reelRefAtom)
  const [{ isPlaying, duration, currentTime }, setReel] =
    useAtom(reelPlayerAtom)
  const router = useRouter()
  const isInCarouselMode = router.asPath.startsWith('/p')

  useEffect(() => {
    setReelRef(localReelRef?.current)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isPlaying])

  const toggleVideo = () => {
    setReel({ duration, currentTime, isPlaying: !isPlaying })
    if (reelRef === null) return
    if (isPlaying === true) {
      reelRef.pause()
    } else {
      reelRef?.play()
      reelRef.onended = function (e) {
        setReel({ duration, currentTime, isPlaying: false })
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (reelRef) {
      setReel({ currentTime, isPlaying, duration: reelRef.duration })
    }
  }

  const handleTimeUpdate = () => {
    if (reelRef) {
      setReel({ isPlaying, duration, currentTime: reelRef.currentTime })
    }
  }

  if (isInCarouselMode) return <></>

  return (
    <>
      <video
        ref={localReelRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlaying={() => setReel({ duration, currentTime, isPlaying: true })}
        controls
        playsInline
        src="//res.cloudinary.com/dxcvsjlxr/video/upload/f_auto:video,q_auto/Kelvonagee_Reel_t14uxl"
        className={cn(
          'fixed left-1/2 top-1/2 z-50 aspect-video max-w-[90vw] -translate-x-1/2 -translate-y-1/2 outline-none md:max-w-[80vw]',
          {
            'pointer-events-none z-[-1] !opacity-0': !isPlaying,
          }
        )}
      />
      {isPlaying && (
        <div
          onClick={() => toggleVideo()}
          className={cn(
            'fixed inset-0 z-30 bg-black bg-opacity-20 opacity-0 backdrop-blur-2xl transition-opacity',
            {
              'opacity-100': isPlaying,
            }
          )}
        >
          &nbsp;
        </div>
      )}
    </>
  )
}
