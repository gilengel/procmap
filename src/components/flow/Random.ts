import { FlowComponent, FlowPointsControl } from '../FlowGraph'
import PointsControl from '../PointsControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Dimension } from '../models'

import RandomWorker from 'worker-loader!./Random.worker'
export default new FlowComponent({
  label: 'random',

  inputs: [
    {
      identifier: 'dimension',
      label: 'Dimension'
    }
  ],

  outputs: [
    {
      identifier: 'points',
      label: 'Points',

      control: {
        control: FlowPointsControl,
        component: PointsControl
      }
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const dimension: Dimension = inputs.dimension.length
        ? (inputs.dimension[0] as Dimension)
        : (node.data.dimenion as Dimension)

      const amount: number = node.data.numPoints as number

      const worker = new RandomWorker()

      node.data.working = true
      worker.postMessage({ amount: amount, dimension: dimension })
      worker.onmessage = (event) => {
        if (event.data.progress === 1.0) {
          node.data.working = false

          outputs.points = event.data.points
          node.data.points = outputs.points

          event.data.progress = 1.0

          resolve()
        } else {
          node.data.progress = event.data.progress
        }
      }
    })
  }
})
