import { atom } from 'jotai'

export interface ReelState {
  mode: 'idle' | 'playing' | 'paused'
  duration: number
  currentTime: number
}

export const reelRefAtom = atom<HTMLVideoElement | null>(null)
export const reelPlayerAtom = atom<ReelState>({
  mode: 'idle',
  duration: 188, // Original veel duration (in seconds)
  currentTime: 0,
})
