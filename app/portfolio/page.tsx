import { Photos } from '@/components/photos'

export default function Work() {
  return (
    <main className="pt-[52px] md:pt-[96px]">
      <div className="flex flex-col w-full">
        <div className="caption pb-1 sticky top-10">
          Film and digital photography
        </div>
        <Photos />
      </div>
    </main>
  )
}
