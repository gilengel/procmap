/* eslint-disable @typescript-eslint/no-empty-function */
<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>View Builder</q-toolbar-title>
          <q-btn
            style="
              background: salmon;
              color: white;
              margin-top: 8px;
              margin-bottom: 8px;
            "
            label="Publish"
            @click="walkGraph(reteNodes)"
          />
        </q-toolbar>

        <div class="row">
          <div class="col-10">
            <grid-layout
              v-model:layout="layout.widgets"
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

          <div class="col-2" v-if="hasSelectedNode">
            <PageOptions :uuid="selectedNode" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue';
import { TempFlow } from 'src/models/Flow';
import { Node as ReteNode } from 'rete';
import { Data, NodeData, NodesData } from 'rete/types/core/data';
import { GridLayout, GridItem } from 'vue-grid-layout';
import FlowGraphWidget from 'src/components/widgets/FlowGraphWidget.vue';
import PageOptions from 'src/components/pageflow_builder/PageOptions.vue';
import getEmitter from 'src/components/EmitterComponent';
import { GetOne, UpdateOne } from '../models/Backend';
import { useQuasar } from 'quasar';
import { mapActions } from 'vuex';
import { convertReteNode2NewPage } from 'src/converters/FlowGraphConverter';

import {
  FLOW_NODE_ADDED,
  FLOW_GRAPH_IMPORTED,
  FLOW_NODE_SELECTED,
  FLOW_GRAPH_MANUALLY_CHANGED,
} from 'src/boot/mitt';

import {
  StartFlowComponent,
  PageFlowComponent,
  EndFlowComponent,
  MetaFlowCategory,
} from 'src/models/Flow';
import { AxiosError } from 'axios';

const routingNodes: Array<MetaFlowCategory> = [
  {
    label: 'Basic',
    icon: '',

    components: [
      {
        id: 'start',
        label: 'Start',
        icon: 'las la-play',
        component: StartFlowComponent,
      },
      {
        id: 'end',
        label: 'End',
        icon: 'las la-stop',
        component: EndFlowComponent,
      },
      {
        id: 'page',
        label: 'Page',
        icon: 'las la-file',
        component: PageFlowComponent,
      },
    ],
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    GridLayout,
    GridItem,
    FlowGraphWidget,
    PageOptions,
  },

  data() {
    return {
      draggable: true,
      resizable: true,
      colNum: 12,
      index: 0,
      hasSelectedNode: false,
      selectedNode: '',
      graphModel: null as TempFlow | null,
      reteNodes: [] as Array<ReteNode>,
    };
  },

  methods: {
    persistFlowModel(node: JSON) {
        console.log(node)
      this.q.notify({
        type: 'warning',
        message: 'updated',
      });

      const model = this.graphModel;

      if (model) {
        //model.data = node;

        //TODO handle promise
        void UpdateOne<TempFlow>(`temp_flow/${model.flow_pk}`, model);
      }
    },

    triggerError(message: string) {
      this.q.notify({
        type: 'negative',
        message: message,
      });
    },

    ...mapActions([
      'Page/storeNewPage',
      'Page/persistNewPage'
    ]),
  },

  mounted() {
    GetOne<TempFlow>(`temp_flow/${this.$route.params.id as string}`)
      .then((flow) => {
        this.editorModel.id = flow.data.id as string
        this.editorModel.nodes = flow.data.nodes as NodesData

        if (flow.data.id && flow.data.nodes) {
          this.emitter?.emit(FLOW_GRAPH_IMPORTED, flow.data);
        }
      })
      .catch((error: Error | AxiosError) => {
        this.triggerError(error.message);
      });

    this.emitter?.on(FLOW_NODE_SELECTED, (node: ReteNode) => {
      this.hasSelectedNode = true;
      this.selectedNode = node.data.uuid as string;
    });
    this.emitter?.on(FLOW_NODE_ADDED, (node: ReteNode) => {
      if (!node.data.page) {
        node.data = Object.assign({}, node.data, {
          page: convertReteNode2NewPage((node as unknown) as NodeData),
        });
      }

      this['Page/storeNewPage'](node.data.page)
      .then(() => {
        console.log(':)')
      }).catch((e : Error)  => {
        this.q.notify({
          type: 'negative',
          message: e.message
        });
      })


      this.reteNodes.push(node);

      this.selectedNode = node.data.uuid as string;
    });
    //this.emitter.on(FLOW_NODE_REMOVED, (node: JSON) => {});

    this.emitter?.on(FLOW_GRAPH_MANUALLY_CHANGED, (node: JSON) => {
      this.persistFlowModel(node);
    });
  },

  setup() {
    const emitter = getEmitter();

    const editorModel : Data = reactive({ id : 'fondo', nodes: [] as unknown as NodesData})
    const layout = reactive({
        id: 'fc339aab-9355-405a-99b3-0ced2fa2361c',
        name: 'Flowchart Layout',
        widgets: [
          {
            i: '78b0262e-392e-4164-9f42-53aac79c4646',
            x: 0,
            y: 0,
            w: 12,
            h: 30,
            movable: false,
            component: 'FlowGraphWidget',
            properties: {
              categories: routingNodes,
              graph: editorModel,
            },
          },
        ],
      })


    const q = useQuasar();

    return {
      emitter,
      q,
      editorModel,
      layout
    };
  },
});
</script>

<style lang="scss">
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
