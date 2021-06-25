<template>
  <q-page>
    <flow-graph :nodes="nodes"
    ></flow-graph>
  </q-page>
</template>

<script lang="ts">
import FlowGraph from 'components/FlowGraph.vue';
import { defineComponent } from 'vue';
import { getRegisteredComponentCategories } from 'src/components/flow/components/Index';

export default defineComponent({
  name: 'PageIndex',
  components: { FlowGraph },

  data() {
      return {
          nodes: getRegisteredComponentCategories()
      }
  }
});
</script>

    FlowGraph
