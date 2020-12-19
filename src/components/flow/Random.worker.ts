
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

  /*
  const points = Array.from({ length: amount }, () => [
    randomX(),
    randomY()
  ])
  */

  const points : Array<[number, number]> = []
  for (let i = 0; i < amount; i++) {
    points.push([randomX(), randomY()])

    ctx.postMessage({ progress: i / amount })
  }

  ctx.postMessage({ progress: 1, points: points })
})
