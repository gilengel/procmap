import { FlowComponent } from '../models/Component'

export default new FlowComponent({
  label: 'Output',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  workerFn: (): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }
})
