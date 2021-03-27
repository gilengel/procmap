/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import { Store } from 'vuex'

const DEFAULT_TEXT = `<strong>Our whole universe was in a hot</strong>, dense state
Then nearly fourteen billion years ago expansion started, wait
The earth began to cool, the autotrophs began to drool
Neanderthals developed tools
We built a wall (we built the pyramids)
Math, science, <strong>history</strong>, unraveling the mysteries
That all started with the big bang! Hey!
Since the dawn of man is really not that long
As every galaxy was formed in less time than it takes to sing this song
A fraction of a second and the elements were made
The bipeds stood up straight, the <strong>dinosaurs all met their</strong> fate
They tried to leap but they were late
And they all died (they froze their asses off)
The oceans and Pangea, see ya wouldn't wanna be ya
Set in motion by the same big bang!
It all started with the big bang!`

export default new FlowComponent({
    label: 'text',

    outputs: [
        {
            type: 'text',
            label: 'Text',
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
          const model = store.getters.model(node.data.uuid);

          let text = DEFAULT_TEXT
          if(model && model.text != text) {
            text = model.text
          }
          outputs.text = text;

          store.dispatch('updateModel', { uuid: node.data.uuid, model: { text: text } })

          resolve()
        })
    }
})
