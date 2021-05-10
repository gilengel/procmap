import { FlowComponent } from '../models/Component'
import DimensionControlVue from 'components/controls/DimensionControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
  label: 'map',

  outputs: [
    {
      type: 'dimension',
      label: 'Dimension',
      mandatory: true,

      control: {
        component: DimensionControlVue
      }
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }
})
