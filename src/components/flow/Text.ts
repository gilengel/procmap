/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from './FlowGraph'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

import { Store } from 'vuex'

import { IWidget } from '../../store/Layout'

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
        store?: Store<unknown>
    ): Promise<void> => {
        return new Promise((resolve) => {
          let widget: IWidget = {
            x: 6,
            y: 0,
            w: 2,
            h: 16,
            static: false,
            component: 'TextWidget',
            properties: {
              text: `Our whole universe was in a hot, dense state
              Then nearly fourteen billion years ago expansion started, wait
              The earth began to cool, the autotrophs began to drool
              Neanderthals developed tools
              We built a wall (we built the pyramids)
              Math, science, history, unraveling the mysteries
              That all started with the big bang! Hey!
              Since the dawn of man is really not that long
              As every galaxy was formed in less time than it takes to sing this song
              A fraction of a second and the elements were made
              The bipeds stood up straight, the dinosaurs all met their fate
              They tried to leap but they were late
              And they all died (they froze their asses off)
              The oceans and Pangea, see ya wouldn't wanna be ya
              Set in motion by the same big bang!
              It all started with the big bang!`
            }
          }

          store?.dispatch('addWidget', { widget: widget });

          outputs.text = widget.properties.text
          resolve()
        })
    }
})
