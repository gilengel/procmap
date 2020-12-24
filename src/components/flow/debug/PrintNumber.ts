import { FlowComponent, getInputValue } from '../../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../../controls/NumberControl.vue'

export default new FlowComponent({
  label: 'PrintNumber',

  inputs: [
    {
      type: 'number',
      label: 'Number',

      control: {
        identifier: 'number',
        component: NumberControl
      }
    }
  ],

  controls: [
    {
      identifier: 'result',
      component: NumberControl
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const term1: number = getInputValue<number>('number', inputs, node)

      console.log(node.data)
      node.data.result = term1

      resolve()
    })
  }
})
