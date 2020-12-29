// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const ctx: Worker = self as any

import * as d3 from 'd3'
import { Voronoi, Delaunay } from 'd3-delaunay'
import { Dimension, Point } from '../models'

function generateRandomPoints (amount: number, dimension: Dimension) : Array<[number, number]> {
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
    const x = Math.floor(randomX())
    const y = Math.floor(randomY())

    // filter out points outside of the dimensions and generate a new point
    // TODO make this more intelligent
    if (x < 0 || x > dimension.width || y < 0 || y > dimension.height) {
      i--
      continue
    }

    points.push([x, y])
  }

  return points
}

/**
 * Generates a voronoi diagram from an array of points. The diagram is bound by the provided size
 * @param points The points used to calculate the voronoi diagram
 * @param size Bound in which the voronoi cells are calculated
 */
function constructVoronoi (points: ArrayLike<Delaunay.Point>, size: Dimension): Voronoi<number> {
  const delaunay: Delaunay<number> = Delaunay.from(points)

  return delaunay.voronoi([0, 0, size.width, size.height])
}

/**
 *
 * @param voronoi The voronoi diagram to relax
 * @param iterations Number of relax iterations, be aware that for each iteration a new voronoi diagram needs to be calculated which can
 * be slow for diagrams with a lot of points (> 10.000)
 *
 * @returns The relaxed voronoi diagram
 */
function relax (voronoi: Voronoi<number>, iterations: number): Voronoi<number> {
  for (let s = 0; s < iterations; ++s) {
    const points = voronoi.delaunay.points as Array<number>

    for (let i = 0; i < points.length; i += 2) {
      const polygon = voronoi.cellPolygon(i >> 1)
      if (polygon === null) continue
      const x0 = points[i],
        y0 = points[i + 1]

      const [x1, y1] = d3.polygonCentroid(polygon as Array<[number, number]>)

      points[i] = x0 + (x1 - x0) * 1.0
      points[i + 1] = y0 + (y1 - y0)
    }

    voronoi.delaunay.points = points

    voronoi.delaunay.update()
    voronoi.update()

    ctx.postMessage({ progress: s / iterations })
  }

  return voronoi
}

ctx.addEventListener('message', (event) => {
  const data = event.data as Record<string, unknown>

  console.log(data)
  const amount = data.amount as number
  const size = data.dimension as Dimension
  const iterations = data.relaxIterations as number
  const points = !data.points ? generateRandomPoints(amount, size) : data.points as Array<[number, number]>

  const voronoi = relax(constructVoronoi(points, size), iterations)
  ctx.postMessage({ progress: 1, voronoi: voronoi, points: points })
})
