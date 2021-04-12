<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Page Builder</q-toolbar-title>
        </q-toolbar>
        <div class="row">
          <div class="col-10">
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
                  :click="clickOnElement"
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
          <div class="col-2 options-container" ref="options_container">
            <ButtonOptions
              :uuid="selectedElement.uuid"
              :model="selectedElement"
              v-if="selectedElement && selectedElement.type === 'Button'"
            />

            <TextOptions
              :uuid="selectedElement.uuid"
              :model="selectedElement"
              v-if="selectedElement && selectedElement.type === 'Text'"
            />
          </div>
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
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import ButtonOptions from "components/ui_builder/ButtonOptions.vue";
import TextOptions from "components/ui_builder/TextOptions.vue";

import {
  Grid,
  Element,
  ElementType,
} from "../models/Grid";

import draggable from "vuedraggable";

@Component({
  name: "MainLayout",

  components: {
    draggable,
    LayoutRow,
    ButtonOptions,
    TextOptions
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

  selectedElement: Element | null = null;

  dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };

  clickOnElement(element: Element) {
      this.selectedElement = element;
      console.log(element)
  }

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

.options-container {
    border: solid 2px $secondary;
}
</style>
