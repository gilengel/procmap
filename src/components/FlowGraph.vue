<template>
  <q-splitter v-model="leftToolbar" style="height: 100%">
    <template #before>
      <flow-graph-node-list :categories="categories" />
    </template>

    <template #after>
      <flow-graph-editor :categories="categories" :graph="graph" />
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FlowGraphNodeList from 'components/FlowGraphNodesList.vue';
import FlowGraphEditor from 'components/FlowGraphEditor.vue';
import { MetaFlowCategory } from 'src/models/flow/Meta';

export default defineComponent({
  name: 'FlowGraph',
  components: { FlowGraphNodeList, FlowGraphEditor },

  props: {
    categories: {
      type: Array as PropType<Array<MetaFlowCategory>>,
      required: true,
    },

    graph: {
      required: false,
      type: Object
    }
  },

  data() {
    return {
      left: true,
      horizontalSplitter: 70,
      verticalSplitter: 50,
      // width of left toolbar
      leftToolbar: 20,
      // width of right toolbar
      rightToolbar: 50,
    };
  },
});
</script>

