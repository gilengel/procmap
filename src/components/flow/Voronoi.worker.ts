// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const ctx: Worker = self as any

import * as d3 from 'd3'
import { Voronoi, Delaunay } from 'd3-delaunay'
import { Dimension } from '../models'

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
  const points = data.points as ArrayLike<Delaunay.Point>
  const size = data.dimension as Dimension
  const iterations = data.relaxIterations as number

  const voronoi = relax(constructVoronoi(points, size), iterations)
  ctx.postMessage({ progress: 1, voronoi: voronoi })
})
