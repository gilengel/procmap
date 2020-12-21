import { FlowComponent, getInputValue, setOutputValue, rejectMessage } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Voronoi, Delaunay } from 'd3-delaunay'

export default new FlowComponent({
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
        isValid: (input: unknown) : boolean => {
          const number = input as number

          return (number >= 0)
        }
      }
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
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const voronoi: Voronoi<number> = getInputValue<Voronoi<number>>('voronoi', inputs, node)
      const amount: number = getInputValue<number>('amount', inputs, node)

      if (voronoi === undefined) {
        reject(rejectMessage('voronoi', 'dimension'))
        return
      }

      const cells = new Map<number, Delaunay.Polygon>()
      for (const cell of voronoi.cellPolygons()) {
        cells.set(cell.index, cell)
      }

      const keys = Array.from(cells.keys())
      let keysLength = keys.length

      let selectedKeys = []
      for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * keysLength)
        const newKey = keys[randomIndex]
        selectedKeys.push(newKey)

        keys.splice(randomIndex, 1)
        keysLength--
      }
      selectedKeys = selectedKeys.sort()

      setOutputValue(node, outputs, 'voronoi', voronoi.delaunay.voronoi([0, 0, 512, 512]))
      setOutputValue(node, outputs, 'indices', selectedKeys)

      resolve()
    })
  }
})
