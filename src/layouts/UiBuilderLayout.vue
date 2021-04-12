<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Page Builder</q-toolbar-title>
        </q-toolbar>
        <div class="row">
          <!--
          <div class="col-2">
            <draggable
              class="q-list q-list--bordered q-list--separator q-list--dark"
              :list="pageElements"
              :group="{ name: 'people', pull: 'clone', put: false }"
              ghost-class="ghost"
              @change="log"
            >
              <q-item
                clickable
                v-ripple
                v-for="element in pageElements"
                :key="element.label"
              >
                <q-item-section avatar>
                  <q-icon color="white" :name="element.icon" />
                </q-item-section>

                <q-item-section>{{ element.label }}</q-item-section>
              </q-item>
            </draggable>
          </div>
          -->
          <div class="col-12">
            <draggable
              class="dragArea list-group"
              @change="log"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group
                type="transition"
                :name="!drag ? 'flip-list' : null"
              >
                <LayoutRow
                  draggable
                  dataKey="itemId"
                  dataValue="Row"
                  :deleteRow="deleteRow"
                  :dropTargetClass="['drop-zone', 'layout-row-divider']"
                  :model="row"
                  :rowIndex="row_index"
                  :key="row_index"
                  v-for="(row, row_index) in model.rows"
                />
              </transition-group>
            </draggable>
          </div>
        </div>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="add" color="secondary" @click="addRow" />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { GridLayout, GridItem } from "vue-grid-layout";
import Layout from "components/ui_builder/Layout.vue";
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import LayoutRowDivider from "components/ui_builder/LayoutRowDivider.vue";
import LayoutColumn from "components/ui_builder/LayoutColumn.vue";
import DraggableListItem from "components/ui_builder/DraggableListItem.vue";
import { Action } from "vuex-class";
import {
  Grid,
  Element,
  ElementType,
  ElementAttributeType,
} from "../models/Grid";

import IModel from "../store/Model";

import { Drop } from "../mixins/Drop";

import draggable from "vuedraggable";

@Component({
  name: "MainLayout",

  components: {
    draggable,
    LayoutRow,
  },
})
export default class UiBuilderLayout extends Vue {
  pageElements = [
    {
      id: "row",
      label: "Row",
      icon: "las la-table",
      type: ElementType.Row,
      defaultData: {},
    },

    {
      id: "text",
      label: "Text",
      icon: "las la-keyboard",
      type: ElementType.Text,
      defaultData: {},
    },

    {
      id: "button",
      label: "Button",
      icon: "las la-paper-plane",
      type: ElementType.Button,
      defaultData: {},
    },
  ];

  model: Grid = {
    rows: [
      {
        columns: [
          { width: 4, element: null },
          { width: 8, element: null },
        ],
      },

      {
        columns: [
          { width: 4, element: null },
          { width: 4, element: null },
          { width: 4, element: null },
        ],
      },

      {
        columns: [
          { width: 6, element: null },
          { width: 6, element: null },
        ],
      },
    ],
  };

  drag = false;

  dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };

  deleteRow(index: number) {
    this.model.rows.splice(index, 1);
  }

  addRow() {
    this.model.rows.push({
      columns: [
        { width: 6, element: null },
        { width: 6, element: null },
      ],
    });
  }

  log(evt) {
    if (evt.added) {
      const index = evt.added.newIndex;

      this.model.rows.splice(index, 0, {
        columns: [
          { width: 6, element: null },
          { width: 6, element: null },
        ],
      });
    }

    if (evt.moved) {
      const temp = this.model.rows.splice(evt.moved.oldIndex, 1)[0];
      this.model.rows.splice(evt.moved.newIndex, 0, temp);
    }
  }
}
</script>

<style lang='scss'>
$size: 24px;
.ghost {
  //border: solid 2px salmon;
  border-radius: 4px;

  color: $secondary;
  //height: $size;

  overflow: collapse;
}
</style>
