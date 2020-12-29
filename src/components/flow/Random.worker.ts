
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const ctx: Worker = self as never

import * as d3 from 'd3'
import { Dimension, Point } from '../models'

ctx.addEventListener('message', (event) => {
  const data = event.data as Record<string, unknown>
  const amount = data.amount as number
  const dimension = data.dimension as Dimension
  const offset = data.offset as Point

  const randomX = d3.randomNormal(
    dimension.width / 2,
    dimension.height / 3
  )
  const randomY = d3.randomNormal(
    dimension.height / 2,
    dimension.height / 3
  )

  const points : Array<[number, number]> = []
  for (let i = 0; i < amount; i++) {
    const x = Math.floor(randomX() + offset.x)
    const y = Math.floor(randomY() + offset.y)

    // filter out points outside of the dimensions and generate a new point
    // TODO make this more intelligent
    if (x < offset.x || x > dimension.width + offset.x || y < offset.y || y > dimension.height + offset.y) {
      i--
      continue
    }

    points.push([x, y])

    ctx.postMessage({ progress: i / amount })
  }

  ctx.postMessage({ progress: 1, points: points })
})
