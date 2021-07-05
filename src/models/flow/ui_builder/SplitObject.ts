import { FlowComponent } from 'src/models/flow/Component'
import { NodeData } from 'rete/types/core/data'

export default new FlowComponent({
  label: 'SplitObject',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  outputs: [
  ],

  /*
  controls: [
    {
      identifier: 'variable',
      component: NameControl
    }
  ],
  */

  workerFn: (
    node: NodeData,
  ): Promise<void> => {
    return new Promise((resolve) => {
      console.log(node)
      resolve()
    })
  }
})
