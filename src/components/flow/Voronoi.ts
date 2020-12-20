
import { FlowComponent, FlowNumberControl, FlowOutput, getInputValue, setOutputValue, setDataForUnconnectedInput } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Delaunay, Voronoi } from 'd3-delaunay'

import { Dimension } from '../models'

import VoronoiWorker from 'worker-loader!./Voronoi.worker'
import { rejects } from 'assert'

export default new FlowComponent({
  label: 'voronoi',

  inputs: [
    {
      identifier: 'dimension',
      label: 'Dimension'
    },

    {
      identifier: 'points',
      label: 'Points'
    },

    {
      identifier: 'number',
      label: 'Iterartions',
      control: {
        identifier: 'iterations',
        control: FlowNumberControl,
        component: NumberControl
      }
    }
  ],

  outputs: [
    {
      identifier: 'voronoi',
      label: 'voronoi',
      value: ''
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const dimension: FlowOutput<Dimension> = getInputValue<Dimension>('dimension', inputs, node)
      const points: FlowOutput<Array<[number, number]>> = getInputValue<Array<[number, number]>>('points', inputs, node)
      const iterations: FlowOutput<number> = getInputValue<number>('iterations', inputs, node)

      if (dimension === undefined || points === undefined || iterations === undefined) {
        reject('one of the input pins has no valid value. Make sure the pins are connected or a valid value is provided via the node control')
        return
      }

      // Stop calculation if input values haven't changed
      if (points.processed && iterations.processed) {
        console.log('nothing to calc')
        outputs.voronoi = node.data.voronoi
        resolve()

        return
      }

      const worker = new VoronoiWorker()

      node.data.working = true

      worker.postMessage({ points: points.value, relaxIterations: iterations.value, dimension: dimension.value })
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.working = false

          node.data.voronoi = { value: data.voronoi as Voronoi<number>, processed: true }
          node.data.voronoi.value.__proto__ = Voronoi.prototype
          node.data.voronoi.value.delaunay.__proto__ = Delaunay.prototype

          node.data.progress = 1.0

          node.data.points = points
          node.data.iterations = iterations

          setDataForUnconnectedInput(node, inputs, 'iterations', iterations.value)

          setOutputValue(node, outputs, 'voronoi', node.data.voronoi.value)

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
