import { FlowComponent, rejectMessage, getInputValue, setOutputValue } from '../../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../../controls/NumberControl.vue'
import { Store } from 'vuex'

export default new FlowComponent({
  label: 'Divide',

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
    outputs: WorkerOutputs,
    store?: Store<unknown>
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const term1: number = getInputValue<number>('number', inputs, node)
      const term2: number = getInputValue<number>('number_2', inputs, node)

      if (store) {
        store.dispatch('MessageModule/addMessage', { message: `Process Node "Division" with inputs [number]=${term1} [number_2]=${term2}` })
      }

      if (!term1) {
        reject(rejectMessage('divide', 'number'))
      }

      if (!term1) {
        reject(rejectMessage('divide', 'number_2'))
      }

      const result = term1 / term2

      setOutputValue(node, outputs, 'number', result, node.outputs.number !== undefined)

      resolve()
    })
  }
})
