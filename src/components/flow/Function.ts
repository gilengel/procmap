import { FlowComponentWithPreview } from '../FlowGraph'
import FunctionControlVue from '../controls/FunctionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponentWithPreview({
  label: 'function',

  inputs: [
    {
      type: 'number',
      label: 'number'
    }
  ],

  outputs: [
    {
      type: 'number',
      label: 'number'
    }
  ],

  controls: [{
    component: FunctionControlVue
  }],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve) => {
      console.log(node)
      console.log(inputs)
      console.log(outputs)
      /*
      const dimension = node.data.dimension as Dimension
      if (!dimension) {
        throw new Error(`FlowComponent[map]: Output value of pin [dimension] has wrong type or is undefined. Typeof == ${typeof (dimension)} `)
      }

      setOutputValue(node, outputs, 'dimension', dimension)
*/
      resolve()
    })
  }
})