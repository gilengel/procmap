const ctx: Worker = self as any

import * as d3 from 'd3'
import { Voronoi, Delaunay } from 'd3-delaunay'
import { Dimension } from '../models'

function constructVoronoi (points: ArrayLike<Delaunay.Point>, size: Dimension): Voronoi<number> {
  const delaunay: Delaunay<number> = Delaunay.from(points)

  return delaunay.voronoi([0, 0, size.width, size.height])
}

function relax (voronoi: Voronoi<number>, size: Dimension, iterations: number): Voronoi<number> {
  for (let s = 0; s < iterations; ++s) {
    const sVoronoi = voronoi.delaunay.voronoi([0, 0, size.width, size.height])
    const points = sVoronoi.delaunay.points as Array<number>

    for (let i = 0; i < points.length; i += 2) {
      const polygon = sVoronoi.cellPolygon(i >> 1)
      if (polygon === null) continue
      const x0 = sVoronoi.delaunay.points[i],
        y0 = points[i + 1]

      const [x1, y1] = d3.polygonCentroid(polygon as Array<[number, number]>)

      points[i] = x0 + (x1 - x0) * 1.0
      points[i + 1] = y0 + (y1 - y0)
    }

    voronoi.delaunay.update()
    // UPDATE!
  }

  return voronoi
}

ctx.addEventListener('message', (event) => {
  const points = event.data.points as ArrayLike<Delaunay.Point>
  const size = event.data.dimension as Dimension
  const relaxIterations = event.data.relaxIterations as number

  const voronoi = relax(constructVoronoi(points, size), size, 0)
  ctx.postMessage({ progress: 1, voronoi: voronoi })
})
