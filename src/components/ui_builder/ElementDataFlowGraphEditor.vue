<template>
  <div class="flow-graph-container column">
    <q-toolbar>
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>
    </q-toolbar>
    <div class="flow">
      <div id="rete" ref="rete"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref } from 'vue';
import 'regenerator-runtime/runtime';

import { Data } from 'rete/types/core/data';
import { MetaFlowCategory } from 'src/models/flow/Meta';
import getEmitter from 'src/components/EmitterComponent';

import flowEditor from 'src/componsables/FlowEditor';
import { UI_ELEMENT_ADDED, UI_ELEMENT_REMOVED } from 'src/boot/mitt';

import { Connection } from 'rete'

const EDITOR_ID = 'demo@0.1.0';

export default defineComponent({
  props: {
    categories: {
      type: Array as PropType<Array<MetaFlowCategory>>,
      default: () => [],
    },

    graph: {
      required: false,
      type: Object as PropType<Data>,
    },

    title: {
      default: 'Editor',
    },
  },

  setup(props) {
    const emitter = getEmitter();
    const rete = ref(null as null | HTMLElement);

    const {
      editor,
      removeNode,
      createEditor,
      enableDragAndDrop,
      createNode,
      //createEventCallback,
    } = flowEditor(EDITOR_ID, props.categories);

    const extractElementsFromReteConnection = (
      connection: Connection
    ): {
      input: Element;
      output: Element;
    } => {
      if (!connection.input.node || !connection.output.node) {
        throw new Error(
          'The newly created connection between two nodes has an invalid input node, an invalid output node or both.'
        );
      }

      if (
        !connection.input.node.data.elementModel ||
        !connection.output.node.data.elementModel
      ) {
        throw new Error(
          'The elementModel is not specified for the input, output or both of the new connection. Check if you set it properly after a new node was created'
        );
      }

      const inputElement = connection.input.node.data.elementModel as Element;
      const outputElement = connection.output.node.data.elementModel as Element;

      /*
      if (!outputElement.outputs || outputElement.outputs.length == 0) {
        // TODO rework in order to make this check obsolet
        throw new Error(
          'You linked an output element that has no defined outputs'
        );
      }
      */

      return { input: inputElement, output: outputElement };
    };

    onMounted(() => {
      createEditor(rete.value as HTMLElement);
      enableDragAndDrop();

      editor.value?.on('connectioncreated', (connection) => {
        const inputNode = connection.input.node;
        const outputNode = connection.output.node;

        console.log(connection)

        if (!inputNode || !outputNode) {
          return;
        }

        if (inputNode.name !== 'Text' || outputNode.name === 'Text') {
          return;
        }

        const { input, output } = extractElementsFromReteConnection(connection);

        console.log(input);
        console.log(output);
        /*
      if (input.outputs) {
        this.linkTwoElements({
          identifier: input.outputs[0].identifier,
          start: output,
          end: input,
        });
      }
      */
      });
    });

    emitter?.on(UI_ELEMENT_ADDED, (element) => {
      createNode(element.type.toLowerCase(), { x: 0, y: 0 }, element.uuid);
    });

    emitter?.on(UI_ELEMENT_REMOVED, (element) => {
      removeNode(element.uuid);
    });

    return {
      editor,
      emitter,
      rete,
    };
  },
});
</script>

<style lang="scss" scoped>
.flow-graph-container {
  min-height: 880x;
}
.flow {
  //position: absolute;
  min-height: 800px !important;

  #rete {
    min-width: 2000px;
    min-height: 850px;
  }
}
</style>
