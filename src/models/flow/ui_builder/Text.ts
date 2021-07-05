import { FlowComponent } from 'src/models/flow/Component'

export default new FlowComponent({
  label: 'Text',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  outputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  workerFn: (
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }
})
