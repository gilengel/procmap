import * as math from 'mathjs'

export function createTrianglePoints(lineStartX: number, lineStartY: number, lineEndX: number, lineEndY: number): string{
  const vec = [lineEndX as number - lineStartX as number, lineEndY - lineStartY]
  const norm = math.norm(vec) as number
  const vecNorm = math.divide(vec, norm)

  const size = 12
  const vecStart = math.multiply(vecNorm, norm)
  const vecEnd = math.multiply(vecNorm, norm - size)
  const vecFinalTop = math.add(math.multiply([-vecNorm[1], vecNorm[0]], size / 2), vecEnd)
  const vecFinalBottom = math.add(math.multiply([-vecNorm[1], vecNorm[0]], -size / 2), vecEnd)


  const p1x = lineStartX + vecStart[0]
  const p1y = lineStartY + vecStart[1]
  const p2x = lineStartX + vecFinalTop[0]
  const p2y = lineStartY + vecFinalTop[1]
  const p3x = lineStartX + vecFinalBottom[0]
  const p3y = lineStartY + vecFinalBottom[1]

  return `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;
}
