import { atom } from 'jotai'

export interface ReelState {
  isPlaying: boolean
  duration: number
  currentTime: number
}

export const reelRefAtom = atom<HTMLVideoElement | null>(null)
export const reelPlayerAtom = atom<ReelState>({
  isPlaying: false,
  duration: 188, // Original veel duration (in seconds)
  currentTime: 0,
})
