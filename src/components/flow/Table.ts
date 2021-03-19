/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'
import { resolve } from 'dns'

export default new FlowComponent({
    label: 'table',

    outputs: [
        {
            type: 'table_data',
            label: 'Data',
            mandatory: true
        }
    ],

    workerFn: (
        _node: NodeData,
        _inputs: WorkerInputs,
        outputs: WorkerOutputs,
        store: Store<unknown>
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            console.log(store)
            resolve()
        })
    }
})
