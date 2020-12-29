
import { FlowComponentWithPreview, getInputValue, setOutputValue, rejectMessage, hasInputValueChanged } from '../FlowGraph'
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
      type: 'number',
      id: 'amount',
      label: 'Amount',

      control: {
        identifier: 'amount',
        component: NumberControl,
        isValid: (input: unknown) : boolean => {
          const number = input as number

          return (number >= 0 && number <= 20000)
        }
      }
    },

    {
      type: 'number',
      id: 'iterations',
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
      node.data.invalid = false

      console.log(node.data)

      const dimension: Dimension = getInputValue<Dimension>('dimension', inputs, node)
      const iterations: number = getInputValue<number>('iterations', inputs, node)
      const amount: number = getInputValue<number>('amount', inputs, node)
      let points: Array<[number, number]> | undefined = node.data.points as Array<[number, number]>

      // generate new random points if the amount of total points or the dimension of the map changed
      if (
        hasInputValueChanged('amount', inputs, node) &&
        hasInputValueChanged('dimension', inputs, node)
      ) {
        console.log('FOOOOOOOOOOOOOOOOOOOOOOO')
        points = undefined
      }

      let rejectCalc = false
      if (dimension === undefined) {
        reject(rejectMessage('voronoi', 'dimension'))
        rejectCalc = true
      }

      if (iterations === undefined || isNaN(iterations)) {
        reject(rejectMessage('voronoi', 'iterations'))
        rejectCalc = true
      }

      if (rejectCalc) {
        node.data.invalid = true
        return
      }

      const worker = new VoronoiWorker()
      worker.postMessage({ points, relaxIterations: isNaN(iterations) ? 1 : iterations, dimension, amount })
      worker.onerror = (e) => {
        console.error(`voronoi web worker failed with error ${e.message}`)
        reject(e)
      }
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.progress = 1.0

          const voronoi = data.voronoi as Voronoi<number>
          voronoi.__proto__ = Voronoi.prototype
          voronoi.delaunay.__proto__ = Delaunay.prototype

          setOutputValue(node, outputs, 'voronoi', voronoi)
          setOutputValue(node, outputs, 'points', data.points)
          setOutputValue(node, outputs, 'iterations', iterations)
          setOutputValue(node, outputs, 'amount', amount)
          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})
