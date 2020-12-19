
import { FlowComponent, FlowNumberControl } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Delaunay, Voronoi } from 'd3-delaunay'

import { Dimension } from '../models'

import VoronoiWorker from 'worker-loader!./Voronoi.worker'

export default new FlowComponent({
  label: 'voronoi',

  inputs: [
    {
      identifier: 'points',
      label: 'points'
    }
  ],

  outputs: [
    {
      identifier: 'voronoi',
      label: 'voronoi',
      value: '',

      control: {
        control: FlowNumberControl,
        component: NumberControl
      }
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve) => {
      const dimension: Dimension = (inputs.dimension && inputs.dimension.length)
        ? (inputs.dimension[0] as Dimension)
        : (node.data.dimenion as Dimension)

      const amount: number = node.data.numPoints as number

      const iterations : number =
      node.data.numPoints || (node.data.numPoints as number) > 0
        ? node.data.numPoints as number
        : 1

      if (inputs.points[0] === undefined || !(inputs.points[0] instanceof Array)) {
        return
      }

      const worker = new VoronoiWorker()

      node.data.working = true

      worker.postMessage({ points: inputs.points[0] as Array<Delaunay.Point>, relaxIterations: iterations, dimension: { width: 512, height: 512 } })
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.working = false

          node.data.voronoi = data.voronoi as Voronoi<number>
          node.data.voronoi.__proto__ = Voronoi.prototype
          node.data.voronoi.delaunay.__proto__ = Delaunay.prototype

          node.data.progress = 1.0

          outputs.voronoi = node.data.voronoi
          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})
/*

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) => {

    let t0 = performance.now()
    const delaunay: Delaunay<number> = Delaunay.from(inputs.points[0] as ArrayLike<Delaunay.Point>)
    const voronoi = delaunay.voronoi([0, 0, 512, 512])
    let t1 = performance.now()
    console.log(`Calc voronoi took ${t1 - t0} ms.`)

    t0 = performance.now()
    for (let s = 0; s < iterations; ++s) {
      const sVoronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])
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
    t1 = performance.now()
    console.log(`Relaxing voronoi took ${t1 - t0} ms.`)

    // node.data.voronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])

  }

})
*/
