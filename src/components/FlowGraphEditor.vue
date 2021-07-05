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
    const rete = ref(null as null | HTMLElement)

    const {
      editor,
      createEditor,
      enableDragAndDrop,
    } = flowEditor(EDITOR_ID, props.categories);

    onMounted(() => {
      createEditor(rete.value as HTMLElement)
      enableDragAndDrop()
    })

    return {
      emitter,
      rete
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
