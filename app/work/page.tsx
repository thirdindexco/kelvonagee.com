import { Photos } from '@/components/photos'

export default function Work() {
  return (
    <main className="pt-[52px] md:pt-[96px]">
      <div className="flex flex-col">
        <div className="caption pb-1">Selected work (2013—2025)</div>
        <Photos />
      </div>
    </main>
  )
}
