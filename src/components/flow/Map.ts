import { FlowComponent, DimensionControl, setOutputValue } from '../FlowGraph'
import DimensionControlVue from '../DimensionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

import { Dimension } from './../models'

export default new FlowComponent({
  label: 'map',

  outputs: [
    {
      identifier: 'dimension',
      label: 'Dimension',

      control: {
        control: DimensionControl,
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

      setOutputValue(node, outputs, 'dimension', dimension)

      resolve()
    })
  }
})
