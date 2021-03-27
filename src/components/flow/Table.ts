/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'

export default new FlowComponent({
  label: 'table',

  inputs: [
    {
      type: 'list',
      label: 'Row Descriptions',
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
      store.dispatch('updateModel', {
        uuid: node.data.uuid,
        model: {
          columns: inputs.list[0],
          data: [
            {
              Ayu: 'Mau',
              Mia: 'Mia',
              Maya: 'Miiiiiauuuuo',
              Elf: 'Schnuuuuur',
              Mobi: 'Plüsch',
              Shira: 'Ffffffch'
            }
          ]
        }
      })

      resolve()
    })
  }
})
