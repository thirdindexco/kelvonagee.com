import { ImageMarquee } from '@/components/image-marquee'

export default function Home() {
  return (
    <main className="relative h-[100dvh] overflow-hidden px-0 pb-0">
      <div className="absolute inset-x-0 bottom-4 md:bottom-6">
        <ImageMarquee />
      </div>
    </main>
  )
}
