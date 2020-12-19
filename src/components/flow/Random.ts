import { FlowComponent, FlowNumberControl } from '../FlowGraph'
import NumberControl from '../NumberControl.vue'
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
    return new Promise((resolve, reject) => {
      const dimension: Dimension = inputs.dimension.length
        ? (inputs.dimension[0] as Dimension)
        : (node.data.dimenion as Dimension)

      const amount: number = node.data.numPoints as number

      const worker = new RandomWorker()

      node.data.working = true
      worker.postMessage({ amount: amount, dimension: dimension })
      worker.onerror = (e) => {
        console.error(`random web worker failed with error ${e.message}`)
        reject(e)
      }
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.working = false

          outputs.points = data.points as Array<[number, number]>
          node.data.points = outputs.points

          node.data.progress = 1.0

          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})