/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'

export default new FlowComponent({
  label: 'table',

  inputs: [
    {
      type: 'map',
      label: 'Map',
      mandatory: true
    },
    {
      type: 'data',
      label: 'Data',
      mandatory: true
    }
  ],

  outputs: [],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    _outputs: WorkerOutputs,
    store: Store<unknown>
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      store.dispatch('updateModel', { uuid: node.data.uuid, model: { columns: inputs.map[0] } })

      resolve()
    })
  }
})
