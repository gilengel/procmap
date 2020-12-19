import { FlowComponent, DimensionControl, setOutputValue } from '../FlowGraph'
import DimensionControlVue from '../DimensionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

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
      setOutputValue(node, outputs, 'dimension', node.data.dimension.value)

      resolve()
    })
  }
})
