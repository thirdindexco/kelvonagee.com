import { atom } from 'jotai'

export const reelRefAtom = atom<HTMLVideoElement | null>(null)
export const reelPlayerAtom = atom<{
  isPlaying: boolean
  duration: number
  currentTime: number
}>({
  isPlaying: false,
  duration: 188, // Original veel duration (in seconds)
  currentTime: 0,
})
