import { FlowComponent } from '../models/Component'

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

  workerFn: (
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }
})
