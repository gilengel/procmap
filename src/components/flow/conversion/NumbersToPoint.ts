import { FlowComponent, rejectMessage, getInputValue, setOutputValue } from '../../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../../controls/NumberControl.vue'

export default new FlowComponent({
  label: 'Make Point',

  inputs: [
    {
      type: 'number',
      label: 'X',

      control: {
        identifier: 'number',
        component: NumberControl
      }
    },
    {
      type: 'number',
      label: 'Y',
      id: 'number_2',

      control: {
        identifier: 'number_2',
        component: NumberControl
      }
    }
  ],

  outputs: [
    {
      type: 'points',
      id: 'result',
      label: 'Point'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const term1: number = getInputValue<number>('number', inputs, node)
      const term2: number = getInputValue<number>('number_2', inputs, node)

      if (!term1) {
        reject(rejectMessage('add', 'number'))
      }

      if (!term1) {
        reject(rejectMessage('add', 'number_2'))
      }

      setOutputValue(node, outputs, 'result', { x: term1, y: term2 }, true)

      resolve()
    })
  }
})
