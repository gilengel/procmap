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

  }
})
