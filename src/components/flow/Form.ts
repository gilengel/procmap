/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'

export default new FlowComponent({
  label: 'form',

  inputs: [],

  outputs: [],

  workerFn: (
    _node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs,
    _store: Store<unknown>
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
})
