import { FlowComponentWithPreview, getInputValue, setOutputValue, rejectMessage } from '../FlowGraph'
import NumberControl from '../controls/NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Voronoi, Delaunay } from 'd3-delaunay'
import { VoronoiModel, Cell } from '../models'

export default new FlowComponentWithPreview({
  label: 'select random',

  inputs: [
    {
      type: 'voronoi',
      label: 'Voronoi',
      value: ''
    },

    {
      type: 'number',
      label: 'Amount',

      control: {
        identifier: 'amount',
        component: NumberControl,
        isValid: (input: unknown): boolean => {
          const number = input as number

          return (number >= 0)
        }
      }
    },

    {
      type: 'function',
      label: 'Function'
    }
  ],

  outputs: [
    {
      type: 'voronoi',
      label: 'voronoi'
    },
    {
      type: 'indices',
      label: 'indices'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const voronoi: VoronoiModel = getInputValue<VoronoiModel>('voronoi', inputs, node)
      const amount: number = getInputValue<number>('amount', inputs, node)

      if (voronoi === undefined) {
        reject(rejectMessage('select_random', 'voronoi'))
        return
      }

      let keysLength = voronoi.cells.length
      const keys = Array.from(Array(keysLength).keys())

      let selectedKeys = []
      for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * keysLength)
        const newKey = keys[randomIndex]
        selectedKeys.push(newKey)

        keys.splice(randomIndex, 1)
        keysLength--
      }
      selectedKeys = selectedKeys.sort()

      setOutputValue(node, outputs, 'voronoi', voronoi)
      setOutputValue(node, outputs, 'indices', selectedKeys)

      resolve()
    })
  }
})
