import type { Bounds } from '@/hooks/useCanvasViewport'

export interface SourceImage {
  public_id: string
  width: number
  height: number
}

export interface CanvasNode {
  id: string
  index: number // index into the full image list (for the lightbox)
  kind: 'photo' | 'reel'
  x: number
  y: number
  w: number
  h: number
  image?: SourceImage
}

const COL_W = 300
const GAP = 36
const REEL_RATIO = 16 / 9

// A tidy masonry grid in world space: each frame drops into the shortest
// column, so heights stay irregular (contact-sheet feel) with no overlaps. The
// reel is a double-width banner centered above the grid — the title card you
// pan up to find.
export function layoutNodes(
  images: SourceImage[],
  cols: number
): { nodes: CanvasNode[]; bounds: Bounds } {
  const colH = new Array(cols).fill(0)
  const nodes: CanvasNode[] = []

  images.forEach((image, index) => {
    let col = 0
    for (let i = 1; i < cols; i++) if (colH[i] < colH[col]) col = i
    const w = COL_W
    const h = Math.round((w * image.height) / image.width)
    nodes.push({
      id: image.public_id,
      index,
      kind: 'photo',
      x: col * (COL_W + GAP),
      y: colH[col],
      w,
      h,
      image,
    })
    colH[col] += h + GAP
  })

  const boardW = cols * COL_W + (cols - 1) * GAP
  const boardH = Math.max(1, ...colH) - GAP

  const reelW = COL_W * 2 + GAP
  const reelH = Math.round(reelW / REEL_RATIO)
  const reelY = -(reelH + GAP * 2.5)
  const reel: CanvasNode = {
    id: 'reel',
    index: -1,
    kind: 'reel',
    x: (boardW - reelW) / 2,
    y: reelY,
    w: reelW,
    h: reelH,
  }

  return {
    nodes: [reel, ...nodes],
    bounds: {
      minX: 0,
      minY: reelY,
      maxX: boardW,
      maxY: Math.max(boardH, 0),
    },
  }
}
