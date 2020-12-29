import { FlowComponent, setOutputValue } from '../FlowGraph'
import DimensionControlVue from '../controls/DimensionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'
import { Dimension } from './../models'

export default new FlowComponent({
  label: 'map',

  outputs: [
    {
      type: 'dimension',
      label: 'Dimension',

      control: {
        component: DimensionControlVue
      }
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve) => {
      const dimension = node.data.dimension as Dimension
      if (!dimension) {
        throw new Error(`FlowComponent[map]: Output value of pin [dimension] has wrong type or is undefined. Typeof == ${typeof (dimension)} `)
      }

      setOutputValue(node, outputs, 'dimension', dimension, node.outputs.dimension !== undefined)
      resolve()
    })
  }
})
