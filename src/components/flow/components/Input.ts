import { FlowComponent } from '../models/Component'
import VariableControlVue from 'components/controls/VariableControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
  label: 'Input',

  outputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,

      control: {
        component: VariableControlVue
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
