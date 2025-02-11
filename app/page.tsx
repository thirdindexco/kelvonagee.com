import { VideoReel } from '@/components/video-reel'

export default function Page() {
  return (
    <main className="grid grid-cols-12 gap-4 relative min-h-dvh pt-[52px] md:pt-[96px]">
      <div className="col-span-12 flex items-center md:items-end h-full md:col-start-9 md:col-span-4">
        <VideoReel />
      </div>
    </main>
  )
}
