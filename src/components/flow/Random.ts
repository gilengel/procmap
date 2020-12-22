import { FlowComponentWithPreview, setOutputValue, getInputValue, rejectMessage, hasInputValueChanged } from '../FlowGraph'
import NumberControl from '../controls/NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Dimension } from '../models'

import RandomWorker from 'worker-loader!./Random.worker'
export default new FlowComponentWithPreview({
  label: 'random',

  inputs: [
    {
      type: 'dimension',
      label: 'Dimension'
    },

    {
      type: 'number',
      label: 'Amount',

      control: {
        identifier: 'amount',
        component: NumberControl,
        isValid: (input: unknown) : boolean => {
          const number = input as number

          return (number >= 0 && number <= 20000)
        }
      }
    }
  ],

  outputs: [
    {
      type: 'dimension',
      label: 'Dimension'
    },

    {
      type: 'points',
      label: 'Points'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const dimension: Dimension = getInputValue<Dimension>('dimension', inputs, node)
      const amount: number = getInputValue<number>('amount', inputs, node)

      if (dimension === undefined) {
        node.data.preview = false
        delete node.data.points
        reject(rejectMessage('random', 'dimension'))
        return
      }

      // avoid recalculating random points if no input values changed

      if (!hasInputValueChanged('amount', inputs, node) && !hasInputValueChanged('dimension', inputs, node)) {
        console.log('Everything stays the same at random :)')

        setOutputValue(node, outputs, 'points', node.data.points, node.outputs.points !== undefined)
        setOutputValue(node, outputs, 'dimension', dimension, node.outputs.dimension !== undefined)

        resolve()

        return
      }

      const worker = new RandomWorker()
      worker.postMessage({ amount: amount, dimension: dimension })
      worker.onerror = (e) => {
        console.error(`random web worker failed with error ${e.message}`)
        reject(e)
      }
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.progress = 1.0

          setOutputValue(node, outputs, 'points', data.points, node.outputs.points !== undefined)
          setOutputValue(node, outputs, 'dimension', dimension, node.outputs.dimension !== undefined)
          setOutputValue(node, outputs, 'amount', amount, node.outputs.amount !== undefined)
          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})
