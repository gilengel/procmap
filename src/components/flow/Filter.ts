import { FlowComponentWithPreview } from '../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import VueNumberControl from '../controls/NumberControl.vue'

export default new FlowComponentWithPreview({
  label: 'filter',

  inputs: [
    {
      type: 'number',
      label: 'Number',

      control: {
        component: VueNumberControl,
        isValid: (input: unknown) : boolean => {
          const number = input as number

          return (number >= 0 && number <= 20000)
        }
      }
    },

    {
      type: 'number',
      id: 'number_2',
      label: 'Number 2',

      control: {
        component: VueNumberControl,
        isValid: (input: unknown) : boolean => {
          const number = input as number

          return (number >= 0 && number <= 20000)
        }
      }
    }
  ],

  outputs: [
    {
      type: 'number',
      label: 'number'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve) => {
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
