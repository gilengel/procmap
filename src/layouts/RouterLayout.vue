<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>View Builder</q-toolbar-title>
          <q-btn flat round dense>
            <q-btn round color="primary" icon="las la-save" />
          </q-btn>
        </q-toolbar>

        <div class="row">
          <div class="col-10">
            <grid-layout
              :layout.sync="layout.widgets"
              :col-num="12"
              :row-height="30"
              :is-draggable="true"
              :is-resizable="true"
              :vertical-compact="true"
              :use-css-transforms="false"
              :margin="[0, 0]"
              class="noselect"
            >
              <grid-item
                v-for="widget in layout.widgets"
                :key="widget.id"
                :static="widget.static"
                :x="widget.x"
                :y="widget.y"
                :w="widget.w"
                :h="widget.h"
                :i="widget.i"
                drag-allow-from=".vue-draggable-handle"
                drag-ignore-from=".no-drag"
              >
                <component
                  :is="widget.component"
                  :uuid="widget.i"
                  v-bind="widget.properties"
                />
              </grid-item>
            </grid-layout>
          </div>
          <div class="col-2">
            <PageOptions />
          </div>
        </div>

        <!--



        -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

import { GridLayout, GridItem } from "vue-grid-layout";
import FlowGraphWidget from "components/FlowGraphWidget.vue";

import { MetaFlowCategory } from "../components/flow/Index";

import Image from "../components/flow/Image";
import Table from "../components/flow/Table";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlowComponent } from "../components/flow/FlowGraph";
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

import PageOptions from "../components/router_builder/PageOptions.vue";

import { v4 as uuidv4 } from "uuid";

import EventBus, {
  ADD_MODEL,
  FLOW_NODE_SELECTED,
  FLOW_NODE_ADDED,
  FLOW_NODE_REMOVED,
} from "../EventBus";

import axios from "axios";

const PageFlowComponent = new FlowComponent({
  label: "page",

  inputs: [
    {
      type: "page",
      label: "Previous",
      mandatory: true,
    },
  ],

  outputs: [
    {
      type: "page",
      label: "Next",
      mandatory: true,
    },
  ],

  /*
  controls: [
    {
      identifier: "page",
      component: PageControl,
    },
  ],
  */

  workerFn: (
    _node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolve();
    });
  },
});

const routingNodes: Array<MetaFlowCategory> = [
  {
    label: "Basic",
    icon: "",

    components: [
      {
        id: "page",
        label: "Page",
        icon: "las la-file",
        component: PageFlowComponent,
        defaultData: {},
      },
      {
        id: "image",
        label: "Image",
        icon: "las la-map-marked",
        component: Image,
        defaultData: {},
      },
    ],
  },
];

interface Widget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  movable: boolean;
  component: string;
  properties?: {};
}

interface View {
  id: string;
  name: string;
  widgets: Array<Widget>;
}

interface Page {
  pk_id: number;
  page_id: String;
  name: String;
  created_at: number;
  fk_layout_id: number;
}

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    FlowGraphWidget,
    PageOptions,
  },
})
export default class RouterLayout extends Vue {
  draggable = true;
  resizable = true;
  colNum = 12;
  index = 0;

  layout: View = {
    id: "fc339aab-9355-405a-99b3-0ced2fa2361c",
    name: "Flowchart Layout",
    widgets: [
      {
        i: "78b0262e-392e-4164-9f42-53aac79c4646",
        x: 0,
        y: 0,
        w: 12,
        h: 30,
        movable: false,
        component: "FlowGraphWidget",
        properties: {
          nodes: routingNodes,
        },
      },
    ],
  };

  mounted() {
    EventBus.$on(FLOW_NODE_ADDED, () => {
      const date = new Date().toJSON().slice(0, -1);
      const pageData = {
        page_id: uuidv4(),
        name: "Some Page",
        created_at: date,
      };
      axios
        .post("http://localhost:8000/pages", pageData)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
           console.log(error)
        });
    });
  }

  getWidgetName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`;
  }
}
</script>

<style lang='scss'>
body {
  background: $dark-page;
}

html,
body {
  height: 100%;
}

.q-toolbar {
  background: $dark !important;
}

.q-banner {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
