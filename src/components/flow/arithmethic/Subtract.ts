import { FlowComponent, rejectMessage, getInputValue, setOutputValue } from '../../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../../controls/NumberControl.vue'

export default new FlowComponent({
  label: 'Subtract',

  inputs: [
    {
      type: 'number',
      label: 'Number',

      control: {
        identifier: 'number',
        component: NumberControl
      }
    },
    {
      type: 'number',
      label: 'Number 2',
      id: 'number_2',

      control: {
        identifier: 'number_2',
        component: NumberControl
      }
    }
  ],

  outputs: [
    {
      type: 'number',
      label: 'Result'
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
        reject(rejectMessage('subtract', 'number'))
      }

      if (!term1) {
        reject(rejectMessage('subtract', 'number_2'))
      }

      setOutputValue(node, outputs, 'number', term1 - term2, true)

      resolve()
    })
  }
})
