import { FlowComponent, setOutputValue } from '../../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../../controls/NumberControl.vue'

export default new FlowComponent({
  label: 'Number',

  outputs: [
    {
      type: 'number',
      id: 'result',
      label: 'Number'
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
      setOutputValue(node, outputs, 'result', node.data.result, true)

      resolve()
    })
  }
})
