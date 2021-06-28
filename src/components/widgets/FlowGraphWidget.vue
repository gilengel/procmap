<template>
  <Widget
    title="Flow"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <FlowGraphComponent :graph="graph" :categories="categories" />
  </Widget>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { MetaFlowCategory } from 'src/models/flow/Meta';
import FlowGraphComponent from 'components/FlowGraph.vue';
import Widget from './Widget.vue';

export default defineComponent({
  name: 'FlowGraphWidget',

  components: {
    Widget,
    FlowGraphComponent,
  },

  props: {
    categories: {
      required: true,
      type: Array as PropType<Array<MetaFlowCategory>>,
      default: () => [],
    },

    graph: {
      required: false,
      type: Object
    },

    resizable: {
      required: false,
      type: Boolean,
      default: false,
    },

    draggable: {
      required: false,
      type: Boolean,
      default: false,
    },

    deletable: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped></style>
