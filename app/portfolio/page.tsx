import { Photos } from '@/components/photos'
import { VideoReel } from '@/components/video-reel'

export default function Portfolio() {
  return (
    <main className="pt-[64px] md:pt-[96px]">
      <Photos />
      <div className="flex justify-end pt-6 md:pt-8">
        <div className="w-full md:max-w-[20rem]">
          <VideoReel />
        </div>
      </div>
    </main>
  )
}
