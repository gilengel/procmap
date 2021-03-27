/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

import { Store } from 'vuex'

export default new FlowComponent({
  label: 'TextFilter',

  inputs: [
    {
      type: 'text',
      label: 'Text',
      mandatory: true
    }
  ],

  outputs: [
    {
      type: 'map',
      label: 'Map',
      mandatory: true
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs,
    store: Store<unknown>
  ): Promise<void> => {
    return new Promise((resolve) => {
      const result = new Array();

      if (inputs.text[0]) {
        const matches = inputs.text[0].matchAll(/<strong>(.*?)<\/strong>/g);

        for (const match of matches) {
          result.push(match[1])
        }
      }

      outputs.map = result

      resolve()
    })
  }
})
