/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from '../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'

const DEFAULT_LIST = [
  'Ayu',
  'Mia',
  'Maya',
  'Elf',
  'Mobi',
  'Shira'
]

export default new FlowComponent({
    label: 'list',

    outputs: [
      {
          type: 'list',
          label: 'List',
          mandatory: true
      }
  ],

    workerFn: (
        node: NodeData,
        _inputs: WorkerInputs,
        outputs: WorkerOutputs,
        store: Store<unknown>
    ): Promise<void> => {
      return new Promise((resolve) => {
        const model = store.getters.model(node.data.uuid)

        let list = DEFAULT_LIST
        if (model && model.list != list) {
          list = model.list
        }
        outputs.list = list

        store.dispatch('updateModel', { uuid: node.data.uuid, model: { list: list } })

        resolve()
      })
    }
})
