import { FlowComponentWithPreview, setOutputValue } from '../FlowGraph'
import FunctionControlVue from '../controls/FunctionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../controls/NumberControl.vue'
// import { evaluate } from 'mathjs'

export default new FlowComponentWithPreview({
  label: 'function',

  inputs: [
    {
      type: 'points',
      label: 'Center'
    },
    {
      type: 'number',
      label: 'Radius',
      id: 'radius',

      control: {
        identifier: 'radius',
        component: NumberControl
      }
    }
  ],

  outputs: [
    {
      type: 'function',
      label: 'Function'
    }
  ],

  controls: [{
    identifier: 'function',
    component: FunctionControlVue
  }],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve) => {
      setOutputValue(node, outputs, 'function', node.data.function, true)
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
