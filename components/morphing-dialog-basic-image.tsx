'use client'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import { XIcon } from 'lucide-react'
import { VideoReel } from './video-reel'
import { useAtom } from 'jotai'
import { reelPlayerAtom } from '@/state'

export function MorphingDialogBasicImage() {
  const [{ isPlaying, duration, currentTime }, setReel] =
    useAtom(reelPlayerAtom)

  // const [showPlayer, setShowPlayer] = useState(false)

  return (
    <MorphingDialog
      transition={{
        duration: 0.15,
        ease: 'easeInOut',
      }}
    >
      <MorphingDialogTrigger>
        <div className="flex flex-col gap-y-2">
          <div>Play Cinematography Reel</div>
          <MorphingDialogImage
            src="//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,ar_16:9,c_fill,w_1220,q_auto/nfreyhnd41z7lzuwddas_vtvhfh"
            alt=""
            className="aspect-video"
          />
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative">
          <VideoReel />
          {/* {showPlayer ? (
            <VideoReel />
          ) : (
            <MorphingDialogImage
              src="//res.cloudinary.com/dxcvsjlxr/image/upload/f_auto,c_limit,w_1200,q_auto/nfreyhnd41z7lzuwddas_vtvhfh"
              alt=""
              className="h-auto w-full aspect-video max-w-[90vw]"
            />
          )} */}
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}
