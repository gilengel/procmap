import { FlowComponent, DimensionControl } from '../FlowGraph'
import DimensionControlVue from '../DimensionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
  label: 'map',

  outputs: [
    {
      identifier: 'dimension',
      label: 'Dimension',
      value: { width: 512, height: 512 },

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
      outputs.dimension = node.data.dimension

      resolve()
    })
  }
})