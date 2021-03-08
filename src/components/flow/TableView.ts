/* eslint-disable */

import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
    label: 'table_view',

    inputs: [
        {
            type: 'table_data',
            label: 'Data'
        }
    ],

    outputs: [
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
