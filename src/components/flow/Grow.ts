import { FlowComponent, FlowNumberControl } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Voronoi } from 'd3-delaunay'

export default new FlowComponent({
  label: 'grow',

  inputs: [
    {
      identifier: 'voronoi',
      label: 'voronoi'
    },
    {
      identifier: 'indices',
      label: 'indices'
    }
  ],

  outputs: [
    {
      identifier: 'indices',
      label: 'indices',

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
      const voronoi: Voronoi<number> = inputs.voronoi[0] as Voronoi<number>

      const selectedKeys = new Set<number>(inputs.indices[0] as Array<number>)

      const iterations = node.data.numPoints ? node.data.numPoints as number : 1
      for (let i = 0; i < iterations; i++) {
        const indices = Array.from(selectedKeys)
        for (const index of indices) {
          for (const neighbour of voronoi.neighbors(index)) {
            selectedKeys.add(neighbour)
          }
        }
      }

      node.data.voronoi = voronoi
      node.data.indices = selectedKeys
      outputs.voronoi = voronoi
      outputs.indices = selectedKeys

      resolve()
    })
  }
})
