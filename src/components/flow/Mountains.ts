import { FlowComponent, FlowNumberControl } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Voronoi } from 'd3-delaunay'
import { Color } from '../models'

export default new FlowComponent({
  label: 'mountains',

  inputs: [
    {
      identifier: 'voronoi',
      label: 'Voronoi'
    },
    {
      identifier: 'indices',
      label: 'Indices'
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
      const voronoi: Voronoi<number> = inputs.voronoi[0] as Voronoi<number>

      const start = 1.0
      const colors = new Map<number, Color>()
      const selectedKeys = new Set<number>(inputs.indices[0] as Array<number>)
      for (const key of selectedKeys) {
        colors.set(key, new Color(start * 255, start * 255, start * 255))
      }

      const falloff = 0.05
      const iterations = node.data.numPoints ? node.data.numPoints as number : 1
      for (let i = 0; i < iterations; i++) {
        const indices = Array.from(selectedKeys)
        for (const index of indices) {
          for (const neighbour of voronoi.neighbors(index)) {
            if (selectedKeys.has(neighbour)) continue

            selectedKeys.add(neighbour)

            let a = start - i * falloff
            a = a < 0.0 ? 0.0 : a

            colors.set(neighbour, new Color(a * 255, a * 255, a * 255))
          }
        }
      }

      node.data.voronoi = voronoi
      node.data.indices = selectedKeys
      node.data.colors = colors
      outputs.voronoi = voronoi
      outputs.indices = selectedKeys

      resolve()
    })
  }

})
