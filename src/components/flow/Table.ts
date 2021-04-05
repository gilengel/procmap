/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'



export default new FlowComponent({
  label: 'table',

  inputs: [
    {
      type: 'table_data',
      label: 'Table',
      mandatory: true
    }
  ],

  outputs: [],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    _outputs: WorkerOutputs,
    store?: Store<unknown>
  ): Promise<void> => {
    return new Promise((resolve, reject) => {

      const model = inputs.table_data[0]
      if (model !== undefined && store) {
        store.dispatch('updateModel', {
          uuid: node.data.uuid,
          model: model
        })
      }

      resolve()
    })
  }
})
