<template>
  <q-splitter v-model="leftToolbar" style="height: 100%">
    <template #before>
      <flow-graph-node-list :nodes="nodes" />
    </template>

    <template #after>
      <flow-graph-editor :nodes="nodes" />
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FlowGraphNodeList from 'components/FlowGraphNodeList.vue';
import FlowGraphEditor from 'components/FlowGraphEditor.vue';
import { MetaFlowCategory } from 'src/components/flow/components/Index';

export default defineComponent({
  name: 'FlowGraph',
  components: { FlowGraphNodeList, FlowGraphEditor },

  props: {
    nodes: {
      type: Array as PropType<Array<MetaFlowCategory>>,
      required: true,
    },
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

