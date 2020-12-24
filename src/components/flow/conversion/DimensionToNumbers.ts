import { FlowComponent, rejectMessage, getInputValue, setOutputValue } from '../../FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NumberControl from '../../controls/NumberControl.vue'
import { Dimension } from 'src/components/models'

export default new FlowComponent({
  label: 'Split Dimension',

  inputs: [
    {
      type: 'dimension',
      label: 'Dimension'
    }
  ],

  outputs: [
    {
      type: 'number',
      label: 'Width',
      id: 'height'
    },

    {
      type: 'number',
      label: 'Height',
      id: 'width'
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ) : Promise<void> => {
    return new Promise((resolve, reject) => {
      const dimension: Dimension = getInputValue<Dimension>('dimension', inputs, node)

      if (!dimension) {
        reject(rejectMessage('dimension2numbers', 'dimension'))
      }

      setOutputValue(node, outputs, 'width', dimension.width, true)
      setOutputValue(node, outputs, 'height', dimension.height, true)

      console.log(dimension.width)

      resolve()
    })
  }
})
