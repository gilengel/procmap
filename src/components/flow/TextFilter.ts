/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
    label: 'Text Filter',

    inputs: [
        {
            type: 'table_data',
            label: 'Text',
            mandatory: true
        }
    ],

    workerFn: (
        _node: NodeData,
        _inputs: WorkerInputs,
        _outputs: WorkerOutputs
    ): Promise<void> => {
        return new Promise((resolve) => {
            resolve()
        })
    }
})
