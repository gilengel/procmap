
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const ctx: Worker = self as never

import * as d3 from 'd3'
import { Dimension } from '../models'

ctx.addEventListener('message', (event) => {
  const data = event.data as Record<string, unknown>
  const amount = data.amount as number
  const dimension = data.dimension as Dimension

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
    const x = randomX()
    const y = randomY()

    // filter out points outside of the dimensions and generate a new point
    // TODO make this more intelligent
    if (x < 0 || x > dimension.width || y < 0 || y > dimension.height) {
      i--
      continue
    }

    points.push([x, y])

    ctx.postMessage({ progress: i / amount })
  }

  ctx.postMessage({ progress: 1, points: points })
})
