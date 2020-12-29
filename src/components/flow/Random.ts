import { FlowComponentWithPreview, setOutputValue, getInputValue, rejectMessage, hasInputValueChanged } from '../FlowGraph'
import NumberControl from '../controls/NumberControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Dimension, Point } from '../models'
import { Store } from 'vuex'

import RandomWorker from 'worker-loader!./Random.worker'
import { assert } from 'console'
export default new FlowComponentWithPreview({
  label: 'random',

  inputs: [
    {
      type: 'dimension',
      label: 'Dimension'
    },

    {
      type: 'points',
      id: 'min',
      label: 'Offset'
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
      let offset: Point = getInputValue<Point>('min', inputs, node)

      console.log(offset)
      if (offset === undefined) {
        offset = { x: 0, y: 0 }
      }

      if (dimension === undefined) {
        node.data.preview = false
        delete node.data.points
        reject(rejectMessage('random', 'dimension'))

        console.log('no dimension')
        return
      }

      // avoid recalculating random points if no input values changed

      if (
        !hasInputValueChanged('amount', inputs, node) &&
        !hasInputValueChanged('dimension', inputs, node) &&
        !hasInputValueChanged('min', inputs, node)
      ) {
        console.log('Everything stays the same at random :)')

        setOutputValue(node, outputs, 'points', node.data.points, node.outputs.points !== undefined)
        setOutputValue(node, outputs, 'dimension', dimension, node.outputs.dimension !== undefined)
        setOutputValue(node, outputs, 'amount', amount, node.outputs.amount !== undefined)

        resolve()

        return
      }

      const worker = new RandomWorker()
      worker.postMessage({ amount: amount, dimension: dimension, offset: offset })
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

          console.assert(data.points instanceof Array, 'node[random].output[points] is not an array')
          console.assert(dimension.width && dimension.width > 0 && dimension.height && dimension.height > 0, 'node[random].output[dimension] is not a valid dimension object with values greater than 0')
          console.assert(amount && amount > 0, 'node[random].output[amount] is not a valid number')

          resolve()
        } else {
          node.data.progress = progress
        }
      }
    })
  }
})
