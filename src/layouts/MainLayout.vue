<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Wuhu</q-toolbar-title>
        </q-toolbar>

        <q-btn label="New Flow" color="primary" @click="createNewFlow = true" />

        <q-dialog v-model="createNewFlow">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Create New Flow</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="newFlowName"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup/>
              <q-btn flat label="Create Flow" v-close-popup  @click="createFlow"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";

import { GridLayout, GridItem } from "vue-grid-layout";
import Widget from "components/Widget.vue";
import TableWidget from "components/TableWidget.vue";
import ImageWidget from "components/ImageWidget.vue";
import TextWidget from "components/TextWidget.vue";
import ChartWidget from "src/components/ChartWidget.vue";
import FlowGraphWidget from "components/FlowGraphWidget.vue";
import MapWidget from "components/MapWidget.vue";
import IdeWidget from "components/IdeWidget.vue";
import TodoWidget from "components/TodoWidget.vue";
import ListWidget from "components/ListWidget.vue";
import FormWidget from "components/FormWidget.vue";

import { getRegisteredComponentCategories } from "components/flow/Index";

import { Node as ReteNode } from "rete";

import { v4 as uuidv4 } from "uuid";

import axios from "axios";

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    Widget,
    TableWidget,
    ImageWidget,
    TextWidget,
    FlowGraphWidget,
    ChartWidget,
    IdeWidget,
    MapWidget,
    TodoWidget,
    ListWidget,
    FormWidget,
  },
})
export default class MainLayout extends Vue {
  createNewFlow: boolean = false;
  newFlowName: String = '';

  createFlow() {
    const hasName = this.newFlowName !== '';

    if(!hasName) {
      return
    }

    const date = new Date().toJSON().slice(0, -1);
    const tempFlow = {
      flow_id: uuidv4(),
      name: this.newFlowName,
      created_at: date,
      data: {}
    }

    const self = this;
    axios
      .post("http://localhost:8000/temp_flow", tempFlow)
      .then(function (response) {
        const result = JSON.parse(response.request.response)

        self.$router.push(`router/${result.flow_id}`)
      })
      .catch(function (error) {
        console.log(error)
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

/*
.vue-grid-layout {
  height: 100vh !important;
  overflow: hidden;
}
.vue-grid-item:not(.vue-grid-placeholder) {
  background: $dark-page;
}
.vue-grid-item .resizing {
  opacity: 0.9;
}
.vue-grid-item .static {
  background: green;
}
.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}
.vue-grid-item .minMax {
  font-size: 12px;
}
.vue-grid-item .add {
  cursor: pointer;
}
.vue-grid-item {
  transform: none impor !important;
}
.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
*/
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
