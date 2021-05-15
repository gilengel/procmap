import { FlowComponent } from '../models/Component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import TypeControlVue from 'src/components/controls/TypeControl.vue'
import OutputControlVue from 'src/components/controls/OutputControl.vue'

export default new FlowComponent({
  label: 'CreateObject',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
      
      control: {
        component: TypeControlVue
      }      
    }
  ],

  outputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  controls: [
    {
      identifier: 'variable',
      component: OutputControlVue
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ): Promise<void> => {
    return new Promise((resolve) => {
      console.log("Create Object")
      resolve()
    })
  }
})
