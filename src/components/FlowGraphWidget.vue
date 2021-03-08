<template>
  
    <q-splitter v-model="leftToolbar" style="height: 100%">
      <template v-slot:before>
        <FlowGraphNodesList />
      </template>

      <template v-slot:after>
        <FlowGraphComponent />
      </template>
    </q-splitter>
    
</template>

<script lang="ts">
import FlowGraphComponent from './flow/FlowGraphComponent.vue'
import { Vue, Component } from 'vue-property-decorator'

import { getRegisteredComponentCategories, MetaFlowCategory } from './flow/Index'

import FlowGraphNodesList from './FlowGraphNodesList.vue'

import TableView from './TableView.vue'

@Component({
  name: 'FlowGraphWidget',

  components: {
    FlowGraphNodesList,
    FlowGraphComponent,
    TableView
  }
})
export default class FlowGraphWidget extends Vue {
  left = true;

  availableComponentCategories: Array<MetaFlowCategory> = [];

  geometry: Record<string, unknown> = {};

  horizontalSplitter = 70;

  verticalSplitter = 50;

  // width of left toolbar
  leftToolbar = 10;

  // width of right toolbar
  rightToolbar = 50;

  mounted () {
    this.availableComponentCategories = getRegisteredComponentCategories()
  }
}
</script>

<style lang="scss" scoped>
</style>