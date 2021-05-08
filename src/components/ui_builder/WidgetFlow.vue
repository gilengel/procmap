<template>
    <div class="widget-flow">
    <q-splitter v-model="leftToolbar" style="height: 80%">
      <template #before>
        <FlowGraphNodesList :nodes="nodes" />
      </template>

      <template #after>
        <FlowGraphComponent
          :graph="graph"
          :nodes="nodes"
        />
      </template>
    </q-splitter>
    </div>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
import FlowGraphNodesList from "components/FlowGraphNodesList.vue";
import FlowGraphComponent from "components/flow/FlowGraphComponent.vue";

import { MetaFlowCategory } from "../flow/Index";
import { Node as ReteNode } from "rete";

import {
  StartFlowComponent,
  PageFlowComponent,
  EndFlowComponent,
} from "./WidgetModel";

const routingNodes: Array<MetaFlowCategory> = [
  {
    label: "Basic",
    icon: "",

    components: [
      {
        id: "start",
        label: "Start",
        icon: "las la-play",
        component: StartFlowComponent,
      },
      {
        id: "end",
        label: "End",
        icon: "las la-stop",
        component: EndFlowComponent,
      },
      {
        id: "page",
        label: "Page",
        icon: "las la-file",
        component: PageFlowComponent,
      },
    ],
  },
];

@Component({
  components: {
    FlowGraphNodesList,
    FlowGraphComponent
  },    
})
export default class WidgetFlow extends Vue {
  nodes = routingNodes;
  @Prop() graph!: Array<ReteNode>;    

  // width of left toolbar
  leftToolbar = 20;
}
</script>

<style lang='scss'>
.widget-flow {
    flex-grow: 2;
}
</style>
