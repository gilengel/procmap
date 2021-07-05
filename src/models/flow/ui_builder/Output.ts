import { FlowComponent } from 'src/models/flow/Component'

export default new FlowComponent({
  label: 'Output',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  /*
  controls: [
    {
      identifier: 'variable',
      component: OutputControlVue
    }
  ],
  */

  workerFn: (
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }
})
