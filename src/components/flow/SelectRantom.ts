import { FlowComponent, FlowNumberControl } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Voronoi, Delaunay } from 'd3-delaunay'

export default new FlowComponent({
  label: 'select random',

  inputs: [
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
      const voronoi: Voronoi<number> = inputs.voronoi[0] as Voronoi<number>

      if (voronoi) {
        const cells = new Map<number, Delaunay.Polygon>()
        for (const cell of voronoi.cellPolygons()) {
          cells.set(cell.index, cell)
        // cells.push(cell);
        }

        const keys = Array.from(cells.keys())
        let keysLength = keys.length
        const numSelected = (node.data.numPoints as number > keysLength) ? keysLength : (node.data.numPoints as number)

        let selectedKeys = []
        for (let i = 0; i < numSelected; i++) {
          const randomIndex = Math.floor(Math.random() * keysLength)
          const newKey = keys[randomIndex]
          selectedKeys.push(newKey)

          keys.splice(randomIndex, 1)
          keysLength--
        }
        selectedKeys = selectedKeys.sort()

        node.data.voronoi = voronoi.delaunay.voronoi([0, 0, 512, 512])
        node.data.indices = selectedKeys

        outputs.voronoi = voronoi
        outputs.indices = selectedKeys
      }

      resolve()
    })
  }
})
