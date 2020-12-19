import { FlowComponent, FlowNumberControl, FlowOutput, setOutputValue, getInputValue, setDataForUnconnectedInput } from '../FlowGraph'
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

          return (number >= 0 && number <= 20000)
        }
      }
    }
  ],

  outputs: [
    {
      identifier: 'dimension',
      label: 'Dimension'
    },

    {
      identifier: 'points',
      label: 'Points'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const dimension: FlowOutput<Dimension> = getInputValue<Dimension>('dimension', inputs, node)
      const amount: FlowOutput<number> = getInputValue<number>('amount', inputs, node)

      // avoid recalculating random points if no input values changed
      if (dimension.processed && amount.processed) {
        console.log('No change in random')
        setOutputValue(node, outputs, 'points', node.data.points.value)
        setOutputValue(node, outputs, 'dimension', dimension.value)

        resolve()

        return
      }

      const worker = new RandomWorker()
      worker.postMessage({ amount: amount.value, dimension: dimension.value })
      worker.onerror = (e) => {
        console.error(`random web worker failed with error ${e.message}`)
        reject(e)
      }
      worker.onmessage = (event) => {
        const data = event.data as Record<string, unknown>
        const progress = data.progress as number
        if (progress === 1.0) {
          node.data.progress = 1.0
          // node.data.amount = amount
          // node.data.points = data.points

          setDataForUnconnectedInput(node, inputs, 'amount', amount.value)

          setOutputValue(node, outputs, 'points', data.points)
          setOutputValue(node, outputs, 'dimension', dimension.value)
          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})
