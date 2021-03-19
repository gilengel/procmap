/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
    label: 'Text',

    inputs: [
        {
            type: 'text',
            label: 'Text',
            mandatory: true
        }
    ],

    workerFn: (
        _node: NodeData,
        inputs: WorkerInputs,
        _outputs: WorkerOutputs
    ): Promise<void> => {
        return new Promise((resolve) => {
            resolve()
        })
    }
})
