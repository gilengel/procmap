import { FlowComponent, FlowNumberControl, FlowOutput, getInputValue, setDataForUnconnectedInput, setOutputValue } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Voronoi, Delaunay } from 'd3-delaunay'

export default new FlowComponent({
  label: 'select random',

  inputs: [
    {
      identifier: 'voronoi',
      label: 'Voronoi',
      value: ''
    },

    {
      identifier: 'number',
      label: 'Amount',

      control: {
        identifier: 'amount',
        control: FlowNumberControl,
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
      identifier: 'voronoi',
      label: 'voronoi'
    },
    {
      identifier: 'indices',
      label: 'indices'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve) => {
      const voronoi: FlowOutput<Voronoi<number>> = getInputValue<Voronoi<number>>('voronoi', inputs, node)
      const amount: FlowOutput<number> = getInputValue<number>('amount', inputs, node)

      if (voronoi) {
        const cells = new Map<number, Delaunay.Polygon>()
        for (const cell of voronoi.value.cellPolygons()) {
          cells.set(cell.index, cell)
        }

        const keys = Array.from(cells.keys())
        let keysLength = keys.length

        let selectedKeys = []
        for (let i = 0; i < amount.value; i++) {
          const randomIndex = Math.floor(Math.random() * keysLength)
          const newKey = keys[randomIndex]
          selectedKeys.push(newKey)

          keys.splice(randomIndex, 1)
          keysLength--
        }
        selectedKeys = selectedKeys.sort()

        setDataForUnconnectedInput(node, inputs, 'amount', amount)

        setOutputValue(node, outputs, 'voronoi', voronoi.value.delaunay.voronoi([0, 0, 512, 512]))
        setOutputValue(node, outputs, 'indices', selectedKeys)
      }

      resolve()
    })
  }
})
