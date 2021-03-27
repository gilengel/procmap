<template>
  <Widget title="Flow" @remove-widget="removeWidget">
    <q-splitter
      v-model="leftToolbar"
      style="height: 100%"
    >
      <template #before>
        <FlowGraphNodesList />
      </template>

      <template #after>
        <FlowGraphComponent v-on="$listeners" />
      </template>
    </q-splitter>
  </Widget>
</template>

<script lang="ts">
import FlowGraphComponent from './flow/FlowGraphComponent.vue'
import { Vue, Component } from 'vue-property-decorator'

import {
  getRegisteredComponentCategories,
  MetaFlowCategory
} from './flow/Index'

import FlowGraphNodesList from './FlowGraphNodesList.vue'
import Widget from './Widget.vue'
@Component({
  name: 'FlowGraphWidget',

  components: {
    FlowGraphNodesList,
    FlowGraphComponent,
  }
})
export default class FlowGraphWidget extends Widget {
  left = true;

  availableComponentCategories: Array<MetaFlowCategory> = [];

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;

  verticalSplitter = 50;

  // width of left toolbar
  leftToolbar = 20;

  // width of right toolbar
  rightToolbar = 50;

  mounted () {
    this.availableComponentCategories = getRegisteredComponentCategories()
  }
}
</script>

<style lang="scss" scoped>
</style>
