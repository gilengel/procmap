<template>
  <Widget title="Flow" @remove-widget="removeWidget">
    <q-splitter v-model="leftToolbar" style="height: 100%">
      <template #before>
        <FlowGraphNodesList :nodes="nodes" />
      </template>

      <template #after>
        <FlowGraphComponent :nodes="nodes" v-html="" v-on="$listeners" />
      </template>
    </q-splitter>
  </Widget>
</template>

<script lang="ts">
import FlowGraphComponent from "./flow/FlowGraphComponent.vue";
import { Component, Prop } from "vue-property-decorator";

import { MetaFlowCategory } from "./flow/Index";

import FlowGraphNodesList from "./FlowGraphNodesList.vue";
import Widget from "./Widget.vue";
@Component({
  name: "FlowGraphWidget",

  components: {
    FlowGraphNodesList,
    FlowGraphComponent,
  },
})
export default class FlowGraphWidget extends Widget {
  @Prop() readonly nodes!: Array<MetaFlowCategory>;

  left = true;

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;

  verticalSplitter = 50;

  // width of left toolbar
  leftToolbar = 20;

  // width of right toolbar
  rightToolbar = 50;
}
</script>

<style lang="scss" scoped>
</style>
