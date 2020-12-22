
import { FlowComponentWithPreview, getInputValue, setOutputValue, rejectMessage } from '../FlowGraph'
import NumberControl from '../controls/NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Delaunay, Voronoi } from 'd3-delaunay'

import { Dimension } from '../models'

import VoronoiWorker from 'worker-loader!./Voronoi.worker'

export default new FlowComponentWithPreview({
  label: 'voronoi',

  inputs: [
    {
      type: 'dimension',
      label: 'Dimension'
    },

    {
      type: 'points',
      label: 'Points'
    },

    {
      type: 'number',
      label: 'Iterartions',
      control: {
        identifier: 'iterations',
        component: NumberControl
      }
    }
  ],

  outputs: [
    {
      type: 'voronoi',
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
      const dimension: Dimension = getInputValue<Dimension>('dimension', inputs, node)
      const points: Array<[number, number]> = getInputValue<Array<[number, number]>>('points', inputs, node)
      const iterations: number = getInputValue<number>('iterations', inputs, node)

      let rejectCalc = false
      if (dimension === undefined) {
        reject(rejectMessage('voronoi', 'dimension'))
        rejectCalc = true
      }

      if (points === undefined) {
        reject(rejectMessage('voronoi', 'points'))
        rejectCalc = true
      }

      if (iterations === undefined || isNaN(iterations)) {
        reject(rejectMessage('voronoi', 'iterations'))
        rejectCalc = true
      }

      if (rejectCalc) return

      const worker = new VoronoiWorker()
      worker.postMessage({ points: points, relaxIterations: isNaN(iterations) ? 1 : iterations, dimension: dimension })
      worker.onerror = (e) => {
        console.error(`voronoi web worker failed with error ${e.message}`)
        reject(e)
      }
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.progress = 1.0

          data.voronoi = data.voronoi as Voronoi<number>
          data.voronoi.__proto__ = Voronoi.prototype
          data.voronoi.delaunay.__proto__ = Delaunay.prototype

          setOutputValue(node, outputs, 'voronoi', data.voronoi, node.outputs.voronoi !== undefined)
          setOutputValue(node, outputs, 'points', data.points, node.outputs.points !== undefined)
          setOutputValue(node, outputs, 'iterations', iterations, node.outputs.iterations !== undefined)

          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})
