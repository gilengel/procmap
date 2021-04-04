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
          <!--
          <div class="col-2" v-if="selectedNode.uuid">
            <PageOptions :uuid="selectedNode.uuid" />
          </div>
          -->
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";

import { GridLayout, GridItem } from "vue-grid-layout";
import FlowGraphWidget from "components/FlowGraphWidget.vue";

import { MetaFlowCategory } from "../components/flow/Index";

import axios from "axios";

import { v4 as uuidv4 } from "uuid";

import PageOptions from "../components/router_builder/PageOptions.vue";

import { ServerSingleResponse } from "../models/ServerResponse";
import { TempFlow } from "../models/TempFlow";

import { GetOne, UpdateOne } from "../models/Backend";

import { Data } from "rete/types/core/data";

import {
  StartFlowComponent,
  PageFlowComponent,
  EndFlowComponent,
  FLOW_ROUTER_START,
  FLOW_ROUTER_PAGE,
  FLOW_ROUTER_END,
} from "./RouterFlowModel";

import { Node as ReteNode } from "rete";

import EventBus, {
  ADD_MODEL,
  FLOW_NODE_SELECTED,
  FLOW_NODE_ADDED,
  FLOW_NODE_REMOVED,
  FLOW_GRAPH_UPDATED,
  FLOW_GRAPH_IMPORTED,
} from "../EventBus";

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
        defaultData: {},
      },
      {
        id: "end",
        label: "End",
        icon: "las la-stop",
        component: EndFlowComponent,
        defaultData: {},
      },
      {
        id: "page",
        label: "Page",
        icon: "las la-file",
        component: PageFlowComponent,
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

const CharacterNames = [
  "Homer Simpson",
  "Marge Simpson",
  "Bart Simpson",
  "Lisa Simpson",
  "Maggie Simpson",
  "Abraham Simpson",
  "Santa's Little Helper",
  "Snowball II/V",
  "Apu Nahasapeemapetilon",
  "Barney Gumble",
  "Bleeding Gums Murphy[B]",
  "Chief Clancy Wiggum",
  "Dewey Largo",
  "Eddie",
  "Edna Krabappel",
  "Itchy & Scratchy",
  "Janey Powell",
  "Jasper Beardly",
  "Kent Brockman",
  "Krusty The Clown",
  "Lenny Leonard",
  "Lou",
  "Martin Prince",
  "Marvin Monroe[C]",
  "Milhouse Van Houten",
  "Moe Szyslak",
  "Mr. Burns",
  "Ned Flanders",
  "Otto Mann",
  "Patty Bouvier",
  "Ralph Wiggum",
  "Reverend Timothy Lovejoy",
  "Selma Bouvier",
  "Seymour Skinner",
  "Sherri & Terri",
];

function convertNodeFromReteToDB(node: ReteNode) {
  const date = new Date().toJSON().slice(0, -1);

  return {
    page_id: node.uuid,
    name: CharacterNames[Math.floor(Math.random() * CharacterNames.length)],
    created_at: date,
  };
}

function convertConnectionFromReteToDB(incoming: ReteNode, outgoing: ReteNode) {
  const date = new Date().toJSON().slice(0, -1);

  const incomingPage = incoming.data.db_id;
  const outgoingPage = outgoing.data.db_id;

  return {
    connection_id: uuidv4(),
    created_at: date,
    incoming_page: incomingPage,
    outgoing_page: outgoingPage,
  };
}

function persistNodeConnection(incoming: ReteNode, outgoing: ReteNode) {
  const dbConnection = convertConnectionFromReteToDB(incoming, outgoing);

  axios
    .post("http://localhost:8000/page_connection", dbConnection)
    .then(function (response) {
      const result = JSON.parse(response.request.response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function walkNode(node: ReteNode) {
  if (node.data.walked) {
    return;
  }

  node.data.walked = true;

  const output = node.outputs.get("page");

  if (output) {
    const incoming = node;

    for (const connection of output.connections) {
      const outgoing = connection.input.node as ReteNode;

      persistNodeConnection(incoming, outgoing);
      walkNode(connection.input.node as ReteNode);
    }
  }
}

function walkGraph(graph: Array<ReteNode>) {
  const startNode = graph.find((node) => node.name === FLOW_ROUTER_START);
  if (!startNode) {
    throw "Persisting aborted: Flow graph has no start point";
  }

  const endNode = graph.find((node) => node.name === FLOW_ROUTER_END);
  if (!endNode) {
    //throw "Persisting aborted: Flow graph has no end point";
  }

  const nodes = new Array();
  for (const node of graph) {
    node.data.walked = undefined;
    nodes.push(convertNodeFromReteToDB(node));
  }

  axios
    .post("http://localhost:8000/pages", nodes)
    .then(function (response) {
      const result = JSON.parse(response.request.response) as [];

      for (const node of graph) {
        const dbResult = result.find(
          (element) => element.page_id === node.uuid
        );
        node.data.db_id = dbResult.page_pk;
      }

      walkNode(startNode);
    })
    .catch(function (error) {
      // console.log(error)
    });
}

function persistNode(node: ReteNode) {
  axios
    .post("http://localhost:8000/pages", pageData)
    .then(function (response) {
      const result = JSON.parse(response.request.response);
      console.log(result);
    })
    .catch(function (error) {
      // console.log(error)
    });
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

  currentRouterGraph: Array<ReteNode> = [];

  @Watch("currentRouterGraph")
  onRouterGraphChanged(graph: Array<ReteNode>, oldVal: Array<ReteNode>) {
    walkGraph(graph);
  }

  selectedNode: Object = {};

  graphModel: TempFlow | null = null;

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
          graph: this.currentRouterGraph,
        },
      },
    ],
  };

  mounted() {
    GetOne<TempFlow>(`temp_flow/${this.$route.params.id}`)
      .then((flow) => {
        this.graphModel = flow;

        EventBus.$emit(FLOW_GRAPH_IMPORTED, flow.data);
      })
      .catch((error) => {
        this.triggerError(error)
      });

    EventBus.$on(FLOW_NODE_ADDED, (node: ReteNode) => {
      this.selectedNode = node;
      //console.log(node.data.uuid);
    });
    EventBus.$on(FLOW_GRAPH_UPDATED, (node: JSON) => {
      const model = this.graphModel;

      if (model) {
        model.data = node;

        UpdateOne<TempFlow>(`temp_flow/${model.flow_pk}`, model);
      }
    });
  }

  getWidgetName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`;
  }

  triggerError(message: string) {
    this.$q.notify({
      type: "negative",
      message: message,
    });
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
