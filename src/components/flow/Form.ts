/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'

export default new FlowComponent({
  label: 'form',

  inputs: [],

  outputs: [
    {
      type: 'model',
      label: 'Model',
      mandatory: true
    },
  ],

  workerFn: (
    node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs,
    store: Store<unknown>
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      //const model = store.getters.model(node.data.uuid)
      //console.log(`Form ${model}`)
      resolve()
    })
  }
})
